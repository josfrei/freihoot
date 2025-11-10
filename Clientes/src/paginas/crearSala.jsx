import React, { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { io } from 'socket.io-client';

const socket = io("http://localhost:4001");

const CrearSala = () => {
    const navega = useNavigate()
    var nickUsuario = sessionStorage.getItem("nickUsuario");

    const [infoCuestionarios, setInfoCuestionarios] = useState({
        "nombreSala": "",
        "idTitulo": "",
        "pinCuestionario": 0
    })

    const [cuestionarios, setCuestionario] = useState([])

    useEffect(() => {
        // buscamos los cuestionarios para seleccionarlos
        const buscaCuestionarios = async () => {
            try {
                const resultado = await axios.get("http://localhost:4000/cuestionarios")
                //console.log("Cuestionarios cargados en crearSala")
                //console.log(resultado.data)
                setCuestionario(resultado.data)
            } catch (error) {
                console.log("Error en crearSala: " + error)
            }

        }
        buscaCuestionarios();

        return () => {
            socket.off("nuevoPinServidor");
        };

    }, [])



    //Es como el getText pero captura cada vez que tecleas
    const gestionCrearSala = async (e) => {
        setInfoCuestionarios((anterior) => ({ ...anterior, [e.target.name]: e.target.value }))
    }

    // Función para solicitar un PIN del servidor
    const solicitarPin = () => {
        return new Promise((resolve) => {
            // Emitimos la solicitud al servidor
            socket.emit("solicitudPin");

            // Escuchamos la respuesta del servidor
            socket.once("nuevoPinServidor", (data) => {
                // console.log("Pin recibido en cliente: " + data.pinAleatorio);
                resolve(data.pinAleatorio);
            });
        });
    };

    //envío los datos
    const enviarCuestionario = async (e) => {
        e.preventDefault();
        const pinAleatorio = await solicitarPin();

        setInfoCuestionarios((anterior) => ({ ...anterior, pinCuestionario: pinAleatorio }));

        const datosAEnviar = {
            PIN: pinAleatorio,
            Cuestionario: infoCuestionarios.idTitulo,
            nombreSala: infoCuestionarios.nombreSala,
            pregunta_actual: -1,
        };
        // console.log("Datos enviados al servidor:", datosAEnviar);

        try {
            await axios.post("http://localhost:4000/sala", datosAEnviar);
        } catch (error) {
            console.log("Error en crearSala enviar datos:", error.message);
        }
        alert("PIN de la sala: " + pinAleatorio)

        //ahroa insertarmos los datos del jugador admin para insertar

        const datosAinsertarJugador = {
            PIN: pinAleatorio,
            nombreJugador: nickUsuario,
            puntuacion: 0
        };

        try {
            //guardarmos el título
            //pasarlo a contexto
            sessionStorage.setItem("nCuestionario", infoCuestionarios.idTitulo);
            sessionStorage.setItem("nombreSala", infoCuestionarios.nombreSala);

            await axios.post("http://localhost:4000/jugador", datosAinsertarJugador);
            navega("/salaAdmin/" + pinAleatorio)
        } catch (error) {
            console.log("Error en pagina seleccion enviar datos:", error.message);
            // Si hay otros errores, los mostramos en la consola
            alert("Ocurrió un error inesperado. Por favor, intenta nuevamente.");
        }
    };

    const irAIndex = () => {
        navega("/menu")
    }

    return (
        <>
            <hr /><hr />
            <div>
                <h2>CREAR SALA</h2>
            </div>
            <hr /><hr /><br />
            <div>
                <input type="text" name="nombreSala" id="nombreSala" placeholder="Introduce nombre para la sala..." style={{ width: "600px", padding: "5px", textAlign: "center" }} onChange={gestionCrearSala} />
                <br />
            </div>
            <div>
                <select className="form-select" style={{ width: "600px", padding: "5px", textAlign: "center" }} name="idTitulo" id="idTitulo" onChange={gestionCrearSala}> {/*vamos a hacer un aconsulta de usuaros y para eso vamos al servidor*/}
                    <option value="0">- - Elige un cuestionario - -</option>
                    {
                        cuestionarios.map((cuestionario, index) => {
                            return (
                                <option value={cuestionario.idCuestionario} key={index}>{cuestionario.tituloCuestionario}</option>
                            )
                        })
                    }
                </select>
            </div>
            <br />
            <div>
                <button onClick={enviarCuestionario} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "40px" }} className="btn btn-outline-info">Crear sala</button>
                <br />
                <button onClick={irAIndex} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", margin: "10px" }} className="btn btn-outline-primary">Volver</button>
            </div>
        </>
    )
}
export default CrearSala
