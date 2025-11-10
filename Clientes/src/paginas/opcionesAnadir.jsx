import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AnadirOpciones = () => {
    const { id } = useParams()
    const navega = useNavigate()

    const [opcionario, setOpciones] = useState({
        "texto": "",
        "es_correcta": "0"
    })

    //para añadir el título de la pregunta
    const [textoPregunta, setPregunta] = useState("");
    //para añadir el título del cuestionario
    const [tituloCuestionario, setTituloCuestionario] = useState("");

    //cargamos los datos de la opción que hay en db
    useEffect(() => {

        const buscaPregunta = async (idPregunta) => {
            try {
                const resultado = await axios.get("http://localhost:4000/pregunta/" + id)
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
        buscaPregunta()
    }, [])

    // capturamos lo que introduce el usuario
    const capturaTextoOpcionnueva = (e) => {
        // console.log(e.target.value) //coprobamos si recibimos lo que escribe el usuario
        setOpciones((anterior) => ({ ...anterior, [e.target.name]: e.target.value }))
    }

    //envío de los datos y redirijo a la pregunta que contiene la opción
    const enviarOpcionario = async (e) => {
        e.preventDefault()
        try {
            await axios.post("http://localhost:4000/opciones/" + id, opcionario)

        } catch (error) {
            console.log(error)
        }
        navega("/opciones/" + id)
    }

    //navego a preguntas
    const irAPreguntas = () => {
        navega("/opciones/" + id)
    }


    return (
        <>
            <div>
                <div>
                    <h6>→ Cuestionarios/Editar cuestionarios/Preguntas/Editar preguntas/AÑADIR OPCIÓN</h6>
                </div>
                <div>
                    <h4> - Cuestionario: "{tituloCuestionario}" -<br />
                        Pregunta: "{textoPregunta}"</h4>
                </div>
                <hr /><hr />
                <div>
                    <h2> AÑADIR OPCIÓN</h2>
                </div>
                <hr /><hr />
                <br />
            </div>
            <div>
                Opción: <input type="text" id="texto" onChange={capturaTextoOpcionnueva} name="texto" placeholder="Introduce la opción..."
                    class="form-control form-control-lg" style={{ width: "700px", padding: "5px", textAlign: "center" }} />
            </div>
            <div>
                <select name="es_correcta" id="es_correcta" onChange={capturaTextoOpcionnueva} class="form-select" style={{ width: "700px", padding: "5px", textAlign: "center", marginTop: "20px" }}>
                    <option value="0">FALSA</option>
                    <option value="1">VERDADERA</option>
                </select>
            </div>
            <div>
                <button onClick={enviarOpcionario} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "40px" }} class="btn btn-outline-info">Insertar opción</button>
                <br />
                <button onClick={irAPreguntas} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} class="btn btn-outline-primary">Volver</button>
            </div>

        </>
    )
}

export default AnadirOpciones