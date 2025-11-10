import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Pregunta = (datos) => {
    const navega = useNavigate()

    const irAPreguntasEditar = (datoId) => {
        navega("/preguntasEditar/" + datoId)
    }
    const borrarPregunta = async (datoId) => {
        //confirmamos si quiere borrar
        const confirmar = window.confirm("¿Quieres eliminar esta pregunta...?")
        if(confirmar){
            try {
                await axios.delete("http://localhost:4000/preguntas/" + datoId)
                location.reload()
            } catch (error) {
                console.error("Error al borrar la pregunta: " , error)
            }
        }
    }

    return (
        <>
            <br />
            <div>
                <div>{"Id pregunta: " + datos.idPreguntas}</div>
                <div>{"Texto: " + datos.texto}</div>
                <div>{"Tiempo respuesta: " + datos.tiempo_respuesta}</div>
                
                {/* ponemos '{() =>{ sadsfdff  }' para que no redirija automáticamente a la siguiente página  } */}
                <button onClick={() => { irAPreguntasEditar(datos.idPreguntas) }}  style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px"}} class="btn btn-outline-info">Editar</button>
                <button onClick={() => { borrarPregunta(datos.idPreguntas) }} style={{ fontSize: "14px", borderRadius: "55px", width: "100px", height: "50px", padding: "5px", margin: "10px" }} class="btn btn-outline-danger">Borrar</button>
            </div>
            <hr />

        </>
    )
}
export default Pregunta