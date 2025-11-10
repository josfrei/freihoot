import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import Opcion from "./opcion";

const Opciones = () => {
    const { id } = useParams()
    const navega = useNavigate()
    const [opciones, setOpciones] = useState([])
    const [texto, setTituloPregunta] = useState("");
    //para añadir el título del cuestionario
    const [tituloCuestionario, setTituloCuestionario] = useState("");

    useEffect(() => {
        const buscaOpciones = async () => {
            try {
                const resultado = await axios.get("http://localhost:4000/opciones/" + id)
                console.log(resultado.data)
                setOpciones(resultado.data)
            } catch (error) {
                console.log(error)
            }
        }
        const buscaPregunta = async () => {
            try {
                const resultado = await axios.get("http://localhost:4000/pregunta/" + id)
                const titulo = resultado.data[0].texto
                const idCuestionario = resultado.data[0].cuestionario_id
                //console.log("Ey makey: "+resultado.data[0].texto)
                setTituloPregunta(titulo);
                buscaCuestionario(idCuestionario);
            } catch (error) {
                console.log(error)
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
        buscaOpciones()

    }, [])

    // para dirigir a añadir opciones
    const anadeOpcion = () => {
        navega("/opcionesAnadir/" + id)
    }

    // para dirigir a preguntas
    const volverAPregunta = () => {
        navega("/preguntasEditar/" + id)
    }

    var nOpciones = 0;

    return (

        <>
            <div>
                <div>
                    <h6>→ Cuestionarios/Editar cuestionarios/Preguntas/Editar preguntas/OPCIONES</h6>
                </div>
                <div>
                    <h4>- Cuestionario: "{tituloCuestionario}" -<br />
                    Pregunta: "{texto || "Cargando título..."}"</h4>
                </div>
                <hr />
                <hr />
                <div>
                    <h2>OPCIONES</h2>
                </div>
                <hr />
                <hr />
            </div>
            <div>
                {opciones.map((opcion) => {
                    {/** hago contador para que no pase de 4 opciones */ }
                    nOpciones++;
                    return (
                        <Opcion
                            idOpciones={opcion.idOpciones}
                            texto={opcion.texto}
                            es_correcta={opcion.es_correcta}
                            key={opcion.idOpciones}></Opcion>
                    )
                })}
            </div>
            <div>
                {/* Condición para mostrar el botón de añadir */}
                {nOpciones < 4 && (
                    <button onClick={anadeOpcion} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} class="btn btn-outline-success">Añadir opciones</button>
                )}</div>

            <div>
                <button onClick={volverAPregunta} style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} class="btn btn-outline-primary">Volver</button>
            </div>
        </>
    )
}

export default Opciones