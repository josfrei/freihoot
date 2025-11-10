import { useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from 'axios'

const Seleccion = () => {
    const navega = useNavigate()

    var nickUsuario = sessionStorage.getItem("nickUsuario");

    const [datos, setDatos] = useState({
        "PIN": 0,
        "nombreUsuario": ""
    })

    //llevamos al menú anterior
    const volver = () => {
        navega("/menu")
    }

    //vamos a escoger sala, comprueba si existe, sino manda una alerta avisando
    const empezarPartida = async (e) => {

        if (datos.PIN === "") {
            alert("Introduce un PIN")
        } else {

            e.preventDefault();
        //    console.log("Pin recibido:" + datos.PIN)
            const datosAEnviar = {
                PIN: datos.PIN,
                nombreJugador: nickUsuario,
                puntuacion: 0
            };
            //console.log("Datos enviados al servidor:", datosAEnviar);

            /**
             * COMPROBAR S PARTIDA ESTA INICIADA O NO
             */
            try {
                await axios.post("http://localhost:4000/jugador", datosAEnviar);
                navega("/sala/" + datos.PIN)
            } catch (error) {
                console.log("Error en pagina seleccion enviar datos:", error.message);
                if (error.response && error.response.status === 404) {
                    // Si el código de estado es 404, es que no se encontró el PIN
                    alert("No existe una sala con ese PIN");
                } else if (error.response && error.response.status === 400) {
                    // Si el código de estado es 400, ya existe el usuario en la sala
                    alert("Ya hay un usuario con ese nick");
                } else {
                    // Si hay otros errores, los mostramos en la consola
                    alert("Ocurrió un error inesperado. Por favor, intenta nuevamente.");
                }
            }

        }
    }

    //Es como el getText pero captura cada vez que tecleas
    const gestionObtenerPin = async (e) => {
        // console.log(e.target.value)
        setDatos((anterior) => ({ ...anterior, [e.target.name]: e.target.value }))
    }


    return (
        <>
            <hr /><hr />
            <div>
                <h2>¡¡INTRODUCE PIN!!</h2>
            </div>
            <hr /><hr /><br />
            <input type="number" name="PIN" id="PIN" placeholder="Introduce pin..." onChange={gestionObtenerPin} min="1" max="10000" style={{ fontSize: "20px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginRight: "20px", marginTop: "10px", textAlign: "center" }} />
            <br /><br />
            <button onClick={empezarPartida} name="jugar" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginRight: "20px", marginTop: "10px" }} className="btn btn-outline-success">JUGAR</button>
            <button onClick={volver} name="volver" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} className="btn btn-outline-primary">VOLVER</button>

        </>
    )

}
export default Seleccion