import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AnadirPreguntas = () => {
    const { id } = useParams()
    const navega = useNavigate()

    const [preguntario, setPreguntas] = useState({
        "texto": "",
        "tiempo_respuesta": 0
    })
    const [tituloCuestionario, setTituloCuestionario] = useState("");

    //captura lo que el ususario introdujo
    const capturarTextoInput = (e) => {
        //console.log(e.target.value) //comprobamos lo que recibimos al pulsar las teclas
        setPreguntas((anterior) => ({ ...anterior, [e.target.name]: e.target.value }))
    }

    //Envío de los datos
    const insertarPreguntas = async (e) => {
        e.preventDefault()
        try {
            await axios.post("http://localhost:4000/preguntas/" + id, preguntario)
        } catch (error) {
            console.log(error)
        }
        navega("/preguntas/" + id)
    }

    //navego a cuestionarios
    const irACuestionarios = () => {
        navega("/preguntas/" + id)
    }

    // Al arrancar busco el título del cuestionario por el id que pasamos por parámetros
    useEffect(() => {
        const buscaCuestionario = async (idCuestionario) => {
            try {
                const resultado = await axios.get("http://localhost:4000/cuestionario/" + id)
                const titulo = resultado.data[0].tituloCuestionario
                //console.log("Ey makey, el id es " + id + " en preguntas editar: " + resultado.data[0].tituloCuestionario)
                setTituloCuestionario(titulo);
            } catch (error) {
                console.log(error)
            }
        }
        buscaCuestionario()
    })

    return (
        <>
            <div>
                <div><h6>→ Cuestionarios/Editar cuestionarios/Preguntas/AÑADIR PREGUNTA</h6></div>
                <hr />
                <div><h4>Cuestionario: "{tituloCuestionario}"</h4></div>
                <hr /><hr />
                <div><h2>NUEVA PREGUNTA</h2></div>
                <hr /><hr /><br />
            </div>
            <div>
                Pregunta: <input type="text" id="texto" onChange={capturarTextoInput} name="texto" placeholder="Introduce la pregunta..."
                    class="form-control form-control-lg" style={{ width: "700px", padding: "5px", textAlign: "center" }} />
            </div>
            <br />
            <div>
                Tiempo máximo: <input type="number" id="u" onChange={capturarTextoInput} name="tiempo_respuesta" class="form-select" style={{ width: "700px", padding: "5px", textAlign: "center", marginTop: "20px" }} />
            </div>
            <br /><br />
            <div>
                <button onClick={insertarPreguntas} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} class="btn btn-outline-success">Crear pregunta</button>
                <br />
                <button onClick={irACuestionarios} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} class="btn btn-outline-primary">Volver</button>
            </div>
        </>
    )


}

export default AnadirPreguntas