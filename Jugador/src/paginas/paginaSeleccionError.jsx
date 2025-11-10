import { useNavigate, useParams } from "react-router-dom"
import React, { useEffect, useState } from "react"

const SeleccionError = () => {
    const { id } = useParams()
    const navega = useNavigate()
    
    var nickUsuario = sessionStorage.getItem("nickUsuario");

    const [pinIntroducido, setPinIntroducido] = useState({
        "PIN": ""
    })

    //llevamos al menú anterior
    const volver = () => {
        navega("/menu")
    }

    //vamos a escoger sala 
    const empezarPartida = () => {
        navega("/formularioCuestionario")
    }

    //Es como el getText pero captura cada vez que tecleas
    const gestionObtenerPin = async (e) => {
       // console.log(e.target.value)
        setPinIntroducido((anterior) => ({ ...anterior, [e.target.name]: e.target.value }))
    }

    return (
        <>
                    <div>
                <h3>EL PIN {id} ES ERRÓNEO</h3>
            </div>
            <hr /><hr />
            <div>
                <h2>¡¡INTRODUCE PIN!!</h2>
            </div>

            <hr /><hr /><br />
            <input type="text" name="PIN" id="PIN" placeholder="Introduce pin..." onChange={gestionObtenerPin} />
            <br /><br />
            <button onClick={empezarPartida} name="jugar" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginRight: "20px", marginTop: "10px" }} className="btn btn-outline-success">JUGAR</button>
            <button onClick={volver} name="volver" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} className="btn btn-outline-primary">VOLVER</button>

        </>
    )

}
export default SeleccionError