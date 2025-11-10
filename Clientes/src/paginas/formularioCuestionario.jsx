import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

//usestate para guardar datos en variables
// useefect para disparar al principio y cada vez que una de las variables que estamos tocando se modifiquen
//useparams para pasar parámetros
//usenavigate para cambiar de páginas

const FormularioCuestionarios = () => {
    const navega = useNavigate()

    const [formulario, setFormulario] = useState({
        "tituloCuestionario": "",
        "creador_id": ""
    })

    const [usuarios, setUsuarios] = useState([])

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
        buscaUsuarios()
    }, [])

    //Es como el getText pero captura cada vez que tecleas
    const gestionFormulario = (e) => {
        // console.log(e.target.value) //comprobamos lo que recibimos
        setFormulario((anterior) => ({ ...anterior, [e.target.name]: e.target.value }))
    }

    //envío de los datos
    const enviarCuestionario = async (e) => {
        e.preventDefault()
        try {
            await axios.post("http://localhost:4000/cuestionarios", formulario)
        } catch (error) {
            console.log(error)
        }
        navega("/cuestionarios")
    }
    const irAIndex = () => {
        navega("/cuestionarios")
    }
    //Ahora lo que mostramos en pantalla
    return (
        <>
            <div>
                <div>
                    <h6>→ Cuestionarios/AÑADIR CUESTIONARIO</h6>
                </div>
                <hr /><hr />
                <div>
                    <h2>AÑADIR CUESTIONARIO</h2>
                </div>
                <hr /><hr />
                <br />
            </div>
            <div>
                <div>
                    <input class="form-control form-control-lg" style={{ width: "700px", padding: "5px" }} type="text" id="tituloCuestionario" onChange={gestionFormulario} name="tituloCuestionario" placeholder="Título..." /><br />
                    <select class="form-select" style={{ width: "700px", padding: "5px", textAlign: "center" }} name="creador_id" id="creador_id" onChange={gestionFormulario}> {/*vamos a hacer un aconsulta de usuaros y para eso vamos al servidor*/}
                        <option value="0">- - Elige un usuario - -</option>
                        {
                            usuarios.map((usuario, index) => {
                                return (
                                    <option value={usuario.idUsuarios} key={index}>{usuario.nombreUsuario}</option>
                                )
                            })
                        }
                    </select></div>
                <br />
                <div>
                    <button onClick={enviarCuestionario} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "40px" }} class="btn btn-outline-info">Enviar cuestionario</button>
                    <br />
                    <button onClick={irAIndex} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", margin: "10px" }} class="btn btn-outline-primary">Volver</button>
                </div>
            </div>
        </>
    )
}

export default FormularioCuestionarios