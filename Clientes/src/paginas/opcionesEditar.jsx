import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarOpciones = () => {
    const { id } = useParams()
    const navega = useNavigate()
    ///********************************   mirar si pone el título en editar y luego ponerlo en añadir y en añadir preg */
    const [opcion, setOpcion] = useState({
        "texto": "",
        "es_correcta": 0,
        "pregunta_id": ""
    })

    //para añadir el título de la pregunta
    const [textoPregunta, setPregunta] = useState("");
    //para añadir el título del cuestionario
    const [tituloCuestionario, setTituloCuestionario] = useState("");

    //cargamos los datos de la opción que hay en db
    useEffect(() => {
        const buscaOpcion = async () => {
            try {
                const resultado = await axios.get("http://localhost:4000/opcion/" + id)
                setOpcion({
                    "texto": resultado.data[0].texto,
                    "es_correcta": resultado.data[0].es_correcta,
                    "pregunta_id": resultado.data[0].pregunta_id
                })
                buscaPregunta(resultado.data[0].pregunta_id)
            } catch (error) {
                console.log("Error en opcionesEditar: " + error)
            }
        }

        const buscaPregunta = async (idPregunta) => {
            try {
                const resultado = await axios.get("http://localhost:4000/pregunta/" + idPregunta)
                const idCuestionario = resultado.data[0].cuestionario_id
                const textoPregunta = resultado.data[0].texto
                //el set es para ponerlo en la página
                setPregunta(textoPregunta)
                buscaCuestionario(idCuestionario);
            } catch (error) {
                console.log("Error en preguntasEditar: " + error)
            }
        }

        const buscaCuestionario = async (idCuestionario) => {
            try {
                const resultado = await axios.get("http://localhost:4000/cuestionario/" + idCuestionario)
                const titulo = resultado.data[0].tituloCuestionario
                //console.log("Ey makey, el id es " + id + " en preguntas editar: " + resultado.data[0].tituloCuestionario)
                setTituloCuestionario(titulo);
            } catch (error) {
                console.log(error)
            }
        }
        buscaOpcion()
    }, [])


    // retorna a la página de la pregunta a la que pertenece
    const irAPreguntas = () => {
        navega("/opciones/" + opcion.pregunta_id)
    }

    //obtiene lo que introduce el usuario
    const capturarTextoInput = (e) => {
        // console.log(e.target.value) //comprobamos lo que recibimos
        setOpcion((anterior) => ({ ...anterior, [e.target.name]: e.target.value }))
    }

    // envía la opción
    const enviarOpcion = async (e) => {
        e.preventDefault()
        try {
            await axios.put("http://localhost:4000/opciones/" + id, opcion)
        } catch (error) {
            console.log(error)
        }
        navega("/opciones/" + opcion.pregunta_id)
    }


    return (
        <>
            <div>
                <div>
                    <h6>→ Cuestionarios/Editar cuestionarios/Preguntas/Editar preguntas/EDITAR OPCIÓN</h6>
                </div>
                <div>
                    <h4> - Cuestionario: "{tituloCuestionario}" -<br />
                    Pregunta: "{textoPregunta}"</h4>
                </div>
                <hr /><hr />
                <div>
                    <h2>EDITAR OPCIÓN <br /><br /> "{opcion.texto}"</h2>
                </div>
                <hr /><hr />
                <br />
            </div>
            <div>
                Opción: <input type="text" id="texto" onChange={capturarTextoInput} name="texto" value={opcion.texto}
                    class="form-control form-control-lg" style={{ width: "700px", padding: "5px", textAlign: "center" }} />
            </div>
            <div>
                <select name="es_correcta" id="es_correcta" onChange={capturarTextoInput} value={opcion.es_correcta} class="form-select" style={{ width: "700px", padding: "5px", textAlign: "center", marginTop: "20px" }}>
                    <option value="0">FALSA</option>
                    <option value="1">VERDADERA</option>
                </select>
            </div>
            <div>
                <br />
                <button onClick={enviarOpcion} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px" }} class="btn btn-outline-info">Aceptar cambios</button>
                <br />
                <button onClick={irAPreguntas} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} class="btn btn-outline-primary">Volver</button>
            </div>

        </>
    )
}

export default EditarOpciones