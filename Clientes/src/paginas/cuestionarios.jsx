import React, { useEffect, useState } from "react"
import axios from 'axios'
import Cuestionario from "./cuestionario"
import { useNavigate } from "react-router-dom"

const Cuestionarios = () => {
    const navega = useNavigate()
    const [cuestionarios, setCuestionarios] = useState([])

    useEffect(() => {
        const buscaCuestionarios = async () => {
            try {
                const resultado = await axios.get("http://localhost:4000/cuestionarios")
                console.log(resultado.data)
                setCuestionarios(resultado.data)
            } catch (error) {
                console.log(error)
            }
        }
        buscaCuestionarios()
    }, []);

    //lleva a la página de añadir cuestionarios
    const anadeCuestionario = () => {
        //creamos la nueva ruta en app.jsx
        navega("/formularioCuestionario")
    }
    // Redirige al menú principal que está en el otro puerto *** REVISAR SI NO VA ***
    const redirigir = () => {
        window.location.href = "http://localhost:5174/menu";
    }

    return (
        <>
            <div>
                <h6>→ CUESTIONARIOS</h6>
            </div>
            <hr /><hr />
            <div>
                <h2>CUESTIONARIOS</h2>
            </div>
            <hr /><hr /><br />
            {cuestionarios.map((cuestionario) => {
                return (
                    <Cuestionario
                        titulo={cuestionario.tituloCuestionario}
                        id_creador={cuestionario.creador_id}
                        id={cuestionario.idCuestionario}
                        key={cuestionario.idCuestionario}></Cuestionario>
                )
            })}
            <button onClick={anadeCuestionario} name="anadeCuestionario" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} class="btn btn-outline-success">Añadir un cuestionario</button>
            <br />
            <button onClick={redirigir} name="irAInicio" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} class="btn btn-outline-primary">MENÚ PRINCIPAL</button>

        </>
    )
}

export default Cuestionarios