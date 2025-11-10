import React from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom"

//usestate para guardar datos en variables
// useefect para disparar al principio y cada vez que una de las variables que estamos tocando se modifiquen
//useparams para pasar parámetros
//usenavigate para cambiar de páginas

const Cuestionario = (datos) => {
    const navega = useNavigate()

    const irAFormularioCuestionarioEditar = (datoId) => {
        navega("/formularioCuestionarioEditar/" + datoId)
    }

    const borrarCuestionario = async (datoId) => {
        //confirmamos si quiere borrar
        const confirmar = window.confirm("¿Quieres eliminar esta pregunta...?")
        if (confirmar) {
            try {
                await axios.delete("http://localhost:4000/cuestionarios/" + datoId)
                location.reload()
            } catch (error) {
                console.error("Error al borrar la pregunta: ", error)
            }
        }
    }

    return (
        <>
            <br />
            <div>
                {/* aqui ponemos las claves que tenemos en cuestionarios*/}
                <div>{"Id: " + datos.id}</div>
                <div>{"Título: " + datos.titulo}</div>
                <div>{"Id creador: " + datos.id_creador}</div>
                <button onClick={() => { irAFormularioCuestionarioEditar(datos.id) }} style={{ fontSize: "14px", borderRadius: "55px", width: "100px", height: "50px", padding: "5px"}} class="btn btn-outline-info">Editar</button>
                <button onClick={() => { borrarCuestionario(datos.id) }} style={{ fontSize: "14px", borderRadius: "55px", width: "100px", height: "50px", padding: "5px", margin: "10px" }} class="btn btn-outline-danger">Borrar</button>
            </div>
            <hr />

        </>)
}

export default Cuestionario