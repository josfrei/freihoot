import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios'
import { io } from 'socket.io-client';
const socket = io("http://localhost:4001");

const JugarPartidaAdmin = () => {
    const navega = useNavigate()
    const { id } = useParams()

    const [jugadores, setJugadores] = useState([]);
    const [preguntas, setPreguntas] = useState([]);
    const [preguntaActual, setPreguntaActual] = useState(null);
    const [nPregunta, setNPregunta] = useState(0);
    const [partidaIniciada, setPartidaIniciada] = useState(false);// 'booleano' para saber si empezó la partida o no, para poner las preguntas en lugar d elos jugadores
    const [opciones, setOpciones] = useState([]);
    const [tiempoFinalizado, setTiempoFinalizado] = useState(false); // 'booleano' para saber si acabó la partida o no, para poner el botón de finalizar
    const coloresBotones = ["red", "blue", "yellow", "green"]
    const colorLetraBoton = ["white", "white", "black", "white"]
    var nickUsuario = sessionStorage.getItem("nickUsuario");

    var idTitulo = sessionStorage.getItem("nCuestionario");
    var nombreSala = sessionStorage.getItem("nombreSala")
    /**
     * ****************************************************
     *  Cargamos jugadores, preguntas y opciones
     * ****************************************************
     */
    // buscamos los jugadores para seleccionarlos
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

    // buscamos los jugadores para seleccionarlos
    const buscaPreguntas = async () => {
        try {
            const resultado = await axios.get("http://localhost:4000/preguntas/" + idTitulo)
            //    console.log(resultado.data)
            setPreguntas(resultado.data)
        } catch (error) {
            console.log(error)
        }
    }

    const buscaOpciones = async (idPregunta) => {
        //  console.log("id pregunta para opciones: " + idPregunta)
        try {
            const resultado = await axios.get(`http://localhost:4000/opciones/${idPregunta}`);
            setOpciones(resultado.data || []); // Evita errores si la respuesta es `null` o `undefined`
        } catch (error) {
            console.log("Error al obtener opciones: ", error);
            setOpciones([]); //borro las opciones antiguas si da error
        }
    };

    /**
     * ****************************************************
     * ****************************************************
     */
    useEffect(() => {
        // cargamos los jugadores
        buscaJugadores();
        //cargamos las preguntas
        buscaPreguntas();

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
            //  console.log('Respuesta del servidor:', data);
            buscaJugadores();
            document.getElementById("mensajeNuevoJugador").innerHTML = data.mensaje.toUpperCase();
        });

        // Escucha la respuesta del servidor de que un jugador se MARCHÓ
        socket.on('avisoJugadorSeVa', (data) => {
            buscaJugadores();  // Actualiza la lista de jugadores cuando un jugador se va
            document.getElementById("mensajeNuevoJugador").innerHTML = data.mensaje.toUpperCase();
        });

        //acualizamos el temporizador
        socket.on('actualizarTemporizador', (data) => {
            document.getElementById("tiempo").innerHTML = "Tiempo: " + data.mensaje + " segundos"
        });

        // Escucha la respuesta del servidor de que finalizo la partida
        socket.on('avisoFinPartida', (data) => {
            setPartidaIniciada(false);
            //   console.log('Aviso del servidor:', data);
            navega("/puntuaciones/" + id + "/" + idTitulo)
        });

        //Asvisamos del fin del tiempo de la pregunta para que aparezca el botón siguiente
        socket.on('mostrarBotonSiguiente', () => {
            setTiempoFinalizado(true);
        });

        // Limpia la conexión cuando el componente se desmonte
        return () => {
            socket.emit('salirSala', { pin: id, nickUsuario });
            socket.off('avisoConexionNuevo');
            socket.off('avisoJugadorSeVa');
            socket.off('actualizarTemporizador');
        };
    }, []);  // Este useEffect solo se ejecuta una vez cuando el componente se monta

    useEffect(() => {
        if (preguntaActual && preguntaActual.id) {
            //   console.log("pregunta ID que paso: " + preguntaActual.id)
            buscaOpciones(preguntaActual.id);
        }
    }, [preguntaActual]);

    /**
     * ****************************************************
     *  Acción botón volver
     * ****************************************************
     */
    const volver = async () => {
        const confirmacion = window.confirm("¿Estás seguro de que quieres salir de la sala?");

        if (!confirmacion) { return } else {

            try {
                await axios.delete("http://localhost:4000/jugador", {
                    data: { nombreJugador: nickUsuario, PIN: id }
                });
            } catch (error) {
                console.log("Error en crearSala enviar datos:", error.message);
            }

            socket.emit('adminSeVa', { pin: id, nickUsuario });
            navega("/seleccionarSala");
        }
    };

    /**
     * Acción para el botón de JUGAR.
     * Comprueba si hay preguntas, si hay pone la primera pregunta y cambia el nPregunta a 1...
     * y así sucesivamente.
     * Pasa boolean partida iniciada a true para cambiar el html.
     * y muestra las opcinoes correspondientes a la pregunta.
     */
    const iniciarPartida = async () => {

        try {
            const response = await axios.post("http://localhost:4000/iniciarPartida", {
                pin: id 
            });
            //console.log("Pregunta actualizada:", response.data);
        } catch (error) {
            console.error("Error al actualizar la pregunta:", error.message);
        }

        if (preguntas.length > 0) {
            setPreguntaActual(preguntas[0]);
            envíaPregunta(preguntas[0], preguntas[0].tiempo_respuesta, preguntas[0].idPreguntas, nPregunta) 
            setNPregunta(0);
            setPartidaIniciada(true);
            buscaOpciones(preguntas[0].idPreguntas);
        }
        socket.emit('iniciarPartida', { pin: id });
    };

    /**
     * Envío al servidor la pregunta
     * @param {*} pregunta 
     */
    const envíaPregunta = (pregunta, tiempo, idPreguntas, nPregunta) => {
        // Evío pregunta al servidor
        socket.emit('pasoPreguntaAServidor', { pin: id, pregunta, tiempo, idPreguntas, nPregunta });
    }

    /**
     * Aviso al servidor que acabó la partida
     */
    const finalizarPartida = () => {
        socket.emit('finalizarPartida', { pin: id })
    }
    /**
     * Acción para el botón "SIGUIENTE" que aparece al iniciar la partida.
     */
    const siguientePregunta = () => {
        setTiempoFinalizado(false)
        const nPreg = nPregunta + 1
        const siguiente = preguntas[nPreg];
        if (siguiente) {
            envíaPregunta(siguiente, siguiente.tiempo_respuesta, siguiente.idPreguntas, nPreg)
            setNPregunta(nPreg);
            setPreguntaActual(siguiente);
            buscaOpciones(siguiente.idPreguntas);
        } else {
            alert("¡Has terminado todas las preguntas!");
        }
    };

    return (
        <>
            <div id="contenidoAdmin">

                {/* si oartida  no está iniciada, es decir false, se muestran los jugadores */}
                {!partidaIniciada ? (
                    <>
                        <hr /><hr />
                        <div id="mensajeNuevoJugador">
                            <br /><br />
                        </div>
                        <div>
                            <h2>Partida con PIN: {id}  y título id: {idTitulo}</h2>
                        </div>

                        <h1>Jugadores</h1>
                        <div id="jugadores">
                            {/* Mostramos los jugadores en una lista */}
                            {jugadores.length > 0 ? (
                                jugadores.map((jugador, index) => (
                                    <div key={index}>
                                        {index === 0 ? (
                                            <h3>{jugador} eres el ADMIN</h3>
                                        ) : (
                                            <h3>{jugador}</h3>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No hay jugadores.</p>
                            )}
                        </div>
                        <hr /><hr /><br />
                        <button onClick={iniciarPartida} name="jugar" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginRight: "20px", marginTop: "10px" }} className="btn btn-outline-success">JUGAR</button>
                        <button onClick={volver} name="volver" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} className="btn btn-outline-primary">SALIR</button>
                    </>
                ) : (
                    <>
                        {/* si oartida iniciada, es decir true, se muestran las preguntas */}
                        {preguntaActual && (
                            <div>
                                <h1>- {nombreSala} -</h1><br />
                                <h2>{nPregunta + 1}º PREGUNTA </h2><br />
                                <h2> {preguntaActual.texto}</h2>
                                <p>
                                    <div id="tiempo">Tiempo: {preguntaActual.tiempo_respuesta} segundos</div>
                                </p>
                                {/* muestra opciones */}
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                                    {opciones.length > 0 ? (
                                        opciones.map((opcion, index) => (
                                            <div key={index} style={{ display: "inline-block", width: "50%", textAlign: "center" }}>
                                                <button key={index} id="respuesta" style={{ fontSize: "20px", color: colorLetraBoton[index % colorLetraBoton.length], backgroundColor: coloresBotones[index % coloresBotones.length], borderRadius: "55px", width: "200px", height: "200px", padding: "5px", marginTop: "40px", border: "none", cursor: "progress", margin: "40px" }}>{opcion.texto}</button>
                                            </div>
                                        ))
                                    ) : (
                                        //mostramos esto si no hay opciones por cualquier motivo
                                        <p>Cargando opciones...</p>
                                    )}
                                </div>

                                {/* si hay opciones se pone siguiente, sino se pone el botón de finalizar, pero ambos una vez que acabe el tiempo*/}
                                {opciones.length > 0 ? (
                                    nPregunta + 1 < preguntas.length ? (

                                        <>
                                            {tiempoFinalizado ? (
                                                <button onClick={siguientePregunta} name="siguiente" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginRight: "20px", marginTop: "10px" }}
                                                    className="btn btn-outline-primary">SIGUIENTE</button>
                                            ) : (
                                                <p>Esperando a que termine el tiempo...</p>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {tiempoFinalizado ? (
                                                <button onClick={finalizarPartida} name="finalizar" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginRight: "20px", marginTop: "10px" }} className="btn btn-outline-success">FINALIZAR</button>
                                            ) : (
                                                <p>Esperando a que termine el tiempo...</p>
                                            )}
                                        </>
                                    )

                                ) : (
                                    <p style={{ fontWeight: "bold", color: "gray" }}>Esperando opciones...</p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default JugarPartidaAdmin;