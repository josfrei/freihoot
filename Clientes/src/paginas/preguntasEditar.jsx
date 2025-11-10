import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Opciones from "./opciones";

const EditarPreguntas = () => {

    const { id } = useParams()
    const navega = useNavigate()

    const [pregunta, setPregunta] = useState({
        "texto": "",
        "tiempo_respuesta": 0,
        "cuestionario_id": ""
    })
    const [tituloCuestionario, setTituloCuestionario] = useState("");


    // aquí hacemos que cargue los datos de la pregunta que hay en la db
    //y a la vez llame a buscar el título dle cuestionario por el id
    useEffect(() => {

        const buscaPregunta = async () => {
            try {
                const resultado = await axios.get("http://localhost:4000/pregunta/" + id)
                setPregunta({
                    "texto": resultado.data[0].texto,
                    "tiempo_respuesta": resultado.data[0].tiempo_respuesta,
                    "cuestionario_id": resultado.data[0].cuestionario_id
                })
                buscaCuestionario(resultado.data[0].cuestionario_id);
            } catch (error) {
                console.log("Error en preguntasEditar: " + error)
            }
        }

        const buscaCuestionario = async (idCuestionario) => {
            try {
                const resultado = await axios.get("http://localhost:4000/cuestionario/" + idCuestionario)
                const titulo = resultado.data[0].tituloCuestionario
                console.log("Ey makey, el id es " + id + " en preguntas editar: " + resultado.data[0].tituloCuestionario)
                setTituloCuestionario(titulo);
            } catch (error) {
                console.log(error)
            }
        }
        buscaPregunta()
    }, [])

    // retorna a la página del formulario al que pertenece
    const irACuestionarios = () => {
        navega("/preguntas/" + pregunta.cuestionario_id)
    }

    //obtiene lo que introduce el usuario
    const capturarTextoInput = (e) => {
        // console.log(e.target.value) //comprobamos lo que recibimos
        setPregunta((anterior) => ({ ...anterior, [e.target.name]: e.target.value }))
    }

    // envía el cuestionario
    const enviarPregunta = async (e) => {
        e.preventDefault()
        try {
            await axios.put("http://localhost:4000/preguntas/" + id, pregunta)
        } catch (error) {
            console.log(error)
        }
        navega("/formularioCuestionarioEditar/" + pregunta.cuestionario_id)
    }

    // lleva a la página de las opciones de la pregunta
    const irAOpciones = () => {
        navega("/opciones/" + id)
    }

    return (
        <>
            <div>
                <div>
                    <h6>→ Cuestionarios/Editar cuestionarios/Preguntas/EDITAR PREGUNTA</h6>
                </div>
                <hr />
                <div>
                    <h4>Cuestionario: "{tituloCuestionario}"</h4>
                </div>
                <hr /><hr />
                <div>
                    <h2>EDITAR PREGUNTA <br /><br /> "{pregunta.texto}"</h2>
                </div>
                <hr /><hr />
                <br />
            </div>
            <div>
                <div>
                    Pregunta: <input class="form-control form-control-lg" style={{ width: "700px", padding: "5px", textAlign: "center" }} type="text" id="texto" onChange={capturarTextoInput} name="texto" value={pregunta.texto}
                    />
                </div>
                <br />
                <div>
                    Tiempo máximo: <input type="number" id="u" onChange={capturarTextoInput} name="tiempo_respuesta" value={pregunta.tiempo_respuesta}
                        class="form-select" style={{ width: "700px", padding: "5px", textAlign: "center" }} />
                </div>
                <br /><br />
                <div>
                    <button onClick={enviarPregunta} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} class="btn btn-outline-success">Aceptar cambios</button>
                </div>
                <div>
                    <button onClick={irAOpciones} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "40px" }} class="btn btn-outline-info">Ver opciones</button>
                </div>
                <br />
                <br />
                <div>
                    <button onClick={irACuestionarios} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} class="btn btn-outline-primary">Volver a las preguntas</button>
                </div>
            </div>
        </>
    )

}
export default EditarPreguntas