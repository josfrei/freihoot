import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import Preguntas from "./preguntas";

//usestate para guardar datos en variables
// useefect para disparar al principio y cada vez que una de las variables que estamos tocando se modifiquen
//useparams para pasar parámetros
//usenavigate para cambiar de páginas

const FormularioCuestionariosEditar = () => {

    const { id } = useParams()
    const navega = useNavigate()

    const [formulario, setFormulario] = useState({
        "tituloCuestionario": "",
        "creador_id": ""
    })


    const [usuarios, setUsuarios] = useState([])

    const irAIndex = () => {
        navega("/cuestionarios")
    }

    // lleva a la página de las opciones de la pregunta
    const irAPreguntas = () => {
        navega("/preguntas/" + id)
    }

    // aquí hacemos que cargue los usuarios que hay en la db
    useEffect(() => {


        const buscaUsuarios = async () => {
            try {
                const resultado = await axios.get("http://localhost:4000/usuarios")
                setUsuarios(resultado.data)
            } catch (error) {
                console.log(error)
            }
        }
        const buscaCuestionario = async () => {
            try {
                const resultado = await axios.get("http://localhost:4000/cuestionario/" + id)
                setFormulario({ "tituloCuestionario": resultado.data[0].tituloCuestionario, "creador_id": resultado.data[0].creador_id })
            } catch (error) {
                console.log(error)
            }
        }
        buscaCuestionario()
        buscaUsuarios()
    }, [])

    const gestionFormulario = (e) => {
        // console.log(e.target.value) //comprobamos lo que recibimos
        setFormulario((anterior) => ({ ...anterior, [e.target.name]: e.target.value }))
    }

    const enviarCuestionario = async (e) => {
        e.preventDefault()
        try {
            await axios.put("http://localhost:4000/cuestionarios/" + id, formulario)

        } catch (error) {
            console.log(error)
        }
        navega("/cuestionarios")

    }

    return (
        <>
            <div>
                <div>
                    <h6>→ Cuestionarios/EDITAR CUESTIONARIO</h6>
                </div>
                <hr /><hr />
                <div>
                    <h2>EDITAR CUESTIONARIO <br /><br /> "{formulario.tituloCuestionario}"</h2>
                </div>
                <hr /><hr />
                <br />
            </div>
            <div>
                <div>
                    Título <input class="form-control form-control-lg" type="text" id="tituloCuestionario" onChange={gestionFormulario} name="tituloCuestionario" value={formulario.tituloCuestionario} style={{ width: "700px", padding: "5px" }} />
                </div>
                <br />
                <div>
                    Creador <select class="form-select" name="creador_id" id="creador_id" onChange={gestionFormulario} value={formulario.creador_id} style={{ width: "700px", padding: "5px", textAlign: "center" }}> {/*vamos a hacer un aconsulta de usuarios y para eso vamos al servidor*/}
                        {
                            usuarios.map((usuario, index) => {
                                return (
                                    <option value={usuario.idUsuarios} key={index}>{usuario.nombreUsuario}</option>

                                )
                            })
                        }
                    </select>
                </div>
                <br />
                <br />
                <div>
                    <button onClick={enviarCuestionario} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} class="btn btn-outline-success">Aceptar cambios</button>
                </div>
                <div>
                    <button onClick={irAPreguntas} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "40px" }} class="btn btn-outline-info">Ver preguntas</button>
                </div>
                <br /><br />
                <div>
                    <button onClick={irAIndex} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "20px" }} class="btn btn-outline-primary">Volver</button>
                </div>
                {/* Aquí añadimos las preguntas correspondientes a los cuestionarios */}
                {/* ANULO LO DE ABAJO, LO DEJO DE EJEMPLO */}
                {/**
                <div>
                    <Preguntas />
                </div> 
                */}
            </div>
        </>
    )
}

export default FormularioCuestionariosEditar