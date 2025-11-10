import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Opcion = (datos) => {
    const navega = useNavigate()

    const irAOpcionesEditar = (datoId) => {
        navega("/opcionesEditar/" + datoId)
    }

    const borraOpcion = async (datoId) => {

        //confirmamos si quiere borrar
        const confirmar = window.confirm("¿Quieres eliminar esta pregunta...?")
        if(confirmar){
            try {
                await axios.delete("http://localhost:4000/opciones/" + datoId)
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
                <div>{"Id opción: " + datos.idOpciones}</div>
                <div>{"Texto: " + datos.texto}</div>
                <div>{"Es correcta: " + datos.es_correcta}</div>
                <div>
                    {/* ponemos '{() =>{ lo que sea que pongamos aquí  }' para que no redirija automáticamente a la siguiente página  } */}
                    <button onClick={() => { irAOpcionesEditar(datos.idOpciones) }} style={{ fontSize: "14px", borderRadius: "55px", width: "100px", height: "50px", padding: "5px"}} class="btn btn-outline-info">Editar</button>
                    <button onClick={() => { borraOpcion(datos.idOpciones) }} style={{ fontSize: "14px", borderRadius: "55px", width: "100px", height: "50px", padding: "5px", margin: "10px" }} class="btn btn-outline-danger">Borrar</button>
                </div>
                <hr />

            </div>
        </>
    )

}
export default Opcion