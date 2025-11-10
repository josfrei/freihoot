import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios'

const Puntuaciones = () => {
    const navega = useNavigate()
    const { id, nC } = useParams()
    const [ranking, setRanking] = useState([])
    const [preguntas, setPreguntas] = useState([]);

    // buscamos el ranking de jugadores
    const buscaRanking = async () => {
        try {
            const resultado = await axios.get("http://localhost:4000/resultados/" + id)
         //   console.log("Ranking", resultado.data.resultadosTotales)
            setRanking(resultado.data.resultadosTotales)
        } catch (error) {
            console.log("Error en buscaRAnking: " + error)
        }
    }
    const obtenerPreguntas = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/preguntasJuego/`+ nC);
            console.log("Ranking", response.data)
            setPreguntas(response.data); 
        } catch (error) {
            console.error("Error al obtener las preguntas:", error);
        }
    };


    // llevamos al menú anterior
    const volver = () => {
        navega("/menu")
    }

    useEffect(() => {
        // cargamos el ranking
        buscaRanking();
        obtenerPreguntas();

    }, []);

    return (
        <>
            <hr /><hr />
            <div>
                <h2>¡¡AHÍ VAN LAS PUNTUACIONES!!</h2><br />
            </div>
            <hr /><hr />
            <div id="puntuacionesGenerales">
                <div><h3>RANKING</h3></div>
                <br />
                <div id="rankingJugadores">
                    {/* Mostramos los jugadores en una lista */}
                    {ranking.length > 0 ? (
                        ranking.map((jugador, index) => (
                            <div key={index}>
                                <h3>{jugador.jugador}: {jugador.puntos} puntos</h3>
                            </div>
                        ))
                    ) : (
                        <p>No hay jugadores.</p>
                    )}
                </div>
            </div>
            <hr />
            <br />
            <div id="resultadosPreguntas">
                <div><h3>Respuestas</h3></div>
                <br />
                <div id="rPregunta">
                    {preguntas.length > 0 ? (
                        preguntas.map((pregunta, index) => (
                            <div key={index}>
                                <h2>{pregunta.pregunta}</h2> 
                                <h3>{pregunta.opcion}</h3>
                            </div>
                        ))
                    ) : (
                        <p>No se han encontrado preguntas.</p>
                    )}
                </div>
                <div id="rOpcion"></div>
                <div id="rAcertantes"></div>
            </div>
            <hr /><hr />
            <br /><br />
            <button onClick={volver} name="volver" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} className="btn btn-outline-primary">VOLVER</button>
        </>
    )
}
export default Puntuaciones
