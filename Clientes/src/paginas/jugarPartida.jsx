import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios'
import { io } from 'socket.io-client';
const socket = io("http://localhost:4001");

const JugarPartida = () => {
    const navega = useNavigate()
    const { id } = useParams()
    const [jugadores, setJugadores] = useState([]);
    var nickUsuario = sessionStorage.getItem("nickUsuario");
    const [partidaIniciada, setPartidaIniciada] = useState(false);// 'booleano' para saber si empezó la partida o no, para poner las preguntas en lugar d elos jugadores
    const [partidaTerminada, setPartidaTerminada] = useState(false); // 'booleano' para saber si acabó la partida o no, para poner el botón de finalizar
    const [preguntaActual, setPreguntaActual] = useState([]);
    const [idPreguntaActual, setIdPreguntaActual] = useState([])
    const [disabled, setDisabled] = useState(false)
    const [opciones, setOpciones] = useState([]);
    const [tiempoRespuesta, setTiempoRespuesta] = useState([])

    // buscamos los cuestionarios para seleccionarlos
    const buscaJugadores = async () => {
        // console.log("Pin que paso: "+id)
        try {
            const resultado = await axios.get("http://localhost:4000/jugador/" + id)
            // console.log("Jugadores en la sala", resultado.data.jugadores)
            setJugadores(resultado.data.jugadores)
        } catch (error) {
            console.log("Error en buscajugadores: " + error)
        }
    }

    useEffect(() => {
        // cargamos los jugadores
        buscaJugadores();

        /*************************************************************/
        /**************             SOCKETS             **************/
        /*************************************************************/

        /*
        // Conecta al servidor
        socket.on("connect", () => {
            console.log("Conexión exitosa con el servidor desde pantalla jugar:", socket.id);
        });
        */

        // Envía un mensaje al servidor conforme el jugador se ha conectado
        socket.emit('entrarEnSala', { pin: id, nickUsuario });

        // Escucha el aviso del servidor de conexión de JUGADOR NUEVO
        socket.on('avisoConexionNuevo', (data) => {
            //    console.log('Respuesta del servidor:', data);
            buscaJugadores();
            const elemento = document.getElementById("mensajeNuevoJugador");

            if (elemento) {
                elemento.innerHTML = data.mensaje.toUpperCase();
            } else {
                console.warn("Elemento 'mensajeNuevoJugador' no encontrado");
            }
        });

        // Escucha la respuesta del servidor de que un jugador se MARCHÓ
        socket.on('avisoJugadorSeVa', (data) => {
            //    console.log('Aviso del servidor:', data);
            buscaJugadores();  // Actualiza la lista de jugadores cuando un jugador se va
            document.getElementById("mensajeNuevoJugador").innerHTML = data.mensaje.toUpperCase();
        });

        // Escucha la respuesta del servidor de inicio la partida
        socket.on('avisoInicioPartida', (data) => {
            //  console.log('Aviso del servidor:', data);
            setPartidaIniciada(true);
          //  document.getElementById("mensajeNuevoJugador").innerHTML = "<h1>" + data.mensaje.toUpperCase() + "</h1>";
           // document.getElementById("jugadores").innerHTML = data.boton;

        });

        // Escucha la respuesta del servidor de que finalizo la partida
        socket.on('avisoFinPartida', (data) => {
            setPartidaIniciada(false);
            //   console.log('Aviso del servidor:', data);
            navega("/puntuaciones")
        });

        // Escucha la respuesta del servidor de que el administrador se fue y se cierra el juego
        socket.on('avisoAdminSeVa', (data) => {
            //    console.log('Aviso del servidor conforme se fue el administrador:', data);
            navega("/sala/err")
        });

        //Recibo la pregunta actual
        socket.on('pasoPreguntaAJugadores', (data) => {
            //console.log('Recibo en jugador: ', data.idPreg);
            setPreguntaActual(data.mensaje)
            setIdPreguntaActual(data.idPreg)
            buscaOpciones(data.idPreg)
            setDisabled(false)
        });

        //acualizamos el temporizador
        socket.on('actualizarTemporizador', (data) => {
            document.getElementById("tiempo").innerHTML = "Tiempo: " + data.mensaje + " segundos"
            setTiempoRespuesta(data.mensaje)
        });

        // Limpia la conexión cuando el componente se desmonte
        return () => {
            socket.emit('salirSala', { pin: id, nickUsuario });
            socket.off('avisoConexionNuevo');
            socket.off('avisoJugadorSeVa');
            socket.off('avisoAdminSeVa');
            socket.off('pasoPreguntaAJugadores');
            socket.off('actualizarTemporizador');
        };
    }, []);  // Este useEffect solo se ejecuta una vez cuando el componente se monta

    /**
     * La idea es buscar 'es_correcta' y asociarlo al valúe de los botones de los botones, luego multiplicar por 
     * 200 ese valor (1 o 0) y sumarle el tiempo (restante * 10)
     */
    const buscaOpciones = async (idPregunta) => {
        // console.log("id pregunta para opciones en buscaopciones jugador: " + idPregunta)
        try {
            const resultado = await axios.get(`http://localhost:4000/opciones/${idPregunta}`);
            const opciones = resultado.data || [];
            setOpciones(opciones.map(opcion => opcion.es_correcta));
            //    console.log(opciones.map(opcion => opcion.es_correcta)); 

        } catch (error) {
            console.log("Error al obtener opciones: ", error);
            setOpciones([]); //borro las opciones antiguas si da error
        }
    };

    /*************************************************************/
    /**************        ACCIONES BOTONES        ***************/
    /*************************************************************/

    //llevamos al menú anterior
    const volver = async () => {
        // Envía un mensaje al servidor conforme el jugador se ha desconectado
        try {
            await axios.delete("http://localhost:4000/jugador", { data: { nombreJugador: nickUsuario, PIN: id } });
        } catch (error) {
            console.log("Error en crearSala enviar datos:", error.message);
        }
        socket.emit('salirDeSala', { pin: id, nickUsuario });

        navega("/seleccionarSala")
    }

    /**
     * Acción para cuando el jugador responde
     */
    const responderPregunta = async (idpregunta, nOpcion, valor) => {
        const puntuacion = calcularPuntuacion(tiempoRespuesta, valor)
        socket.emit('respuestaJugador', { pin: id, nickUsuario, idpregunta, nOpcion, puntuacion });
        setDisabled(true)
    }

    /**
     * Calculo la puntuación y lo paso para qeu lo reciba el servidor y lo inserte
     * @param {*} tiempoRestante 
     * @param {*} valor 
     * @returns 
     */
    const calcularPuntuacion = (tiempoRestante, valor) => {
        const puntos = tiempoRestante * 10;
        const puntosAciert = valor * 200
        console.log("Puntos: " + puntos + " puntos aciertos " + puntosAciert)

        const puntosPregunta = puntos + puntosAciert

        return puntosPregunta
    }

    return (
        <>
            <div id="contenido">
                {/* si la partida no está inciada pone los jugadores, sino muestra las opciones */}
                {!partidaIniciada ? (
                    <>
                        <hr /><hr />
                        <div id="mensajeNuevoJugador">

                        </div>                            <br /><br />
                        <div>
                            <h2>Partida con PIN: {id}</h2>
                        </div>
                        <div><h1>Jugadores</h1>
                            <div id="jugadores">
                                {/* Mostramos los jugadores en una lista */}
                                {jugadores.length > 0 ? (
                                    jugadores.map((jugador, index) => (
                                        <div key={index}>
                                            {index == 0 ? (<h3>Admin: {jugador}</h3>) : (
                                                <h3>{jugador}</h3>)}
                                        </div>
                                    ))
                                ) : (
                                    <p>No hay jugadores.</p>
                                )}
                            </div>
                        </div>
                        <hr /><hr /><br />
                        <button onClick={volver} name="volver" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} className="btn btn-outline-primary">SALIR</button>
                    </>
                ) : (
                    <>
                        <div>
                            <h3>{preguntaActual}</h3><br />
                            <div id="tiempo">Tiempo: {preguntaActual.tiempo_respuesta} segundos</div>
                            <br />
                        </div>
                        <div id="botonesOpciones">
                            <button id="respuesta1" disabled={disabled} onClick={() => responderPregunta(idPreguntaActual, "opcionA", opciones[0])} style={{ fontSize: "40px", backgroundColor: "red", borderRadius: "55px", width: "150px", height: "150px", padding: "5px", marginTop: "40px", color: "white", border: "none", cursor: "pointer", margin: "20px" }} value={opciones[0] || 0} >▲</button>
                            <button id="respuesta2" disabled={disabled} onClick={() => responderPregunta(idPreguntaActual, "opcionB", opciones[1])} style={{ fontSize: "40px", backgroundColor: "blue", borderRadius: "55px", width: "150px", height: "150px", padding: "5px", marginTop: "40px", color: "white", border: "none", cursor: "pointer" }} value={opciones[1] || 0} >■</button>
                            <br />
                            <button id="respuesta3" disabled={disabled} onClick={() => responderPregunta(idPreguntaActual, "opcionC", opciones[2])} style={{ fontSize: "40px", backgroundColor: "yellow", borderRadius: "55px", width: "150px", height: "150px", padding: "5px", marginTop: "40px", color: "black", border: "none", cursor: "pointer", margin: "20px" }} value={opciones[2] || 2}  >O</button>
                            <button id="respuesta4" disabled={disabled} onClick={() => responderPregunta(idPreguntaActual, "opcionD", opciones[3])} style={{ fontSize: "40px", backgroundColor: "green", borderRadius: "55px", width: "150px", height: "150px", padding: "5px", marginTop: "40px", color: "white", border: "none", cursor: "pointer" }} value={opciones[3] || 0} >@</button></div>

                    </>
                )}
            </div>
        </>
    )

}
export default JugarPartida