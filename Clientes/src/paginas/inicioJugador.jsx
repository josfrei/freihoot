import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'


const InicioJugador = () => {
    const navega = useNavigate()

    const [introduceNick, setNick] = useState({
        "nick": ""
    })

    //obtiene lo que introduce el usuario
    const capturarTextoInput = (e) => {
        // console.log(e.target.value) //comprobamos lo que recibimos
        setNick((anterior) => ({ ...anterior, [e.target.name]: e.target.value }))
    }

    const entrarAlMenu = () => {
        sessionStorage.setItem("nickUsuario", introduceNick.nick);
        //creamos la nueva ruta en app.jsx
        navega("/menu")
    }
        
    
    
    return (
        <>
            <hr /><hr />
            <div>
                <h2>¡¡BIENVENIDO!!</h2>
            </div>
            <hr /><hr /><br /><div>
                <input type="text" onChange={capturarTextoInput} name="nick" id="nick" placeholder="Introduce nick..." style={{ fontSize: "20px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginRight: "20px", marginTop: "10px", textAlign: "center" }} />
            </div>
            <br /><br />
            <div>
                <button onClick={entrarAlMenu} name="unirPartida" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} className="btn btn-outline-danger">ACEPTAR</button>
            </div>
        </>
    )
}

export default InicioJugador