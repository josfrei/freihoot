import { useNavigate, useParams } from "react-router-dom"

const SeleccionError = () => {
    const navega = useNavigate()

    //llevamos al menú anterior
    const volver = () => {
        navega("/menu")
    }

    return (
        <>
            <hr /><hr />
            <div>
                <h2>¡¡EL ADMINISTRADOR DE HA IDO!!</h2><br />
                <h3>SE CANCELA LA PARTIDA</h3>
            </div>

            <hr /><hr />
            <br /><br />
            <button onClick={volver} name="volver" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} className="btn btn-outline-primary">VOLVER</button>

        </>
    )

}
export default SeleccionError