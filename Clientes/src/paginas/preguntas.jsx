import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Pregunta from "./pregunta";
import axios from "axios";

const Preguntas = () => {
    const { id } = useParams()
    const navega = useNavigate()
    const [preguntas, setPreguntas] = useState([])
    const [tituloCuestionario, setTituloCuestionario] = useState("");

    useEffect(() => {
        const buscaPreguntas = async () => {
            try {
                const resultado = await axios.get("http://localhost:4000/preguntas/" + id)
                console.log(resultado.data)
                setPreguntas(resultado.data)
            } catch (error) {
                console.log(error)
            }
        }

        const buscaCuestionario = async () => {
            try {
                const resultado = await axios.get("http://localhost:4000/cuestionario/" + id)
                const titulo = resultado.data[0].tituloCuestionario
                //console.log("Ey makey: "+resultado.data[0].tituloCuestionario)
                setTituloCuestionario(titulo);
            } catch (error) {
                console.log(error)
            }
        }
        buscaCuestionario()
        buscaPreguntas()
    }, []);

    //lleva a la página de añadir preguntas
    const anadePregunta = () => {
        //creamos la nueva ruta en app.jsx
        navega("/preguntasAnadir/" + id)
    }

    // para dirigir a añadir cuestionario
    const volverACuestionario = () => {
        navega("/formularioCuestionarioEditar/" + id)
    }
    return (

        <>
            <div>
                <h6>→ Cuestionarios/Editar cuestionarios/PREGUNTAS</h6>
            </div>
            <hr />
            <div>
                <h4>CUESTIONARIO: "{tituloCuestionario || "Cargando título..."}"</h4>
            </div>
            <hr /><hr />
            <div>
                <h2>PREGUNTAS</h2>
            </div>
            <hr /><hr />
            <div>
                {preguntas.map((pregunta) => {
                    return (
                        <Pregunta
                            idPreguntas={pregunta.idPreguntas}
                            texto={pregunta.texto}
                            tiempo_respuesta={pregunta.tiempo_respuesta}
                            key={pregunta.idPreguntas}></Pregunta>
                    )
                })}
            </div>
            <div>
                <button onClick={anadePregunta} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} class="btn btn-outline-success">+ Añadir preguntas</button>
            </div>
            <div>
                <button onClick={volverACuestionario} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} class="btn btn-outline-primary">Volver</button>
            </div>
        </>
    )
}

export default Preguntas