import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const PaginaInicial = () => {
    const navega = useNavigate()
    var nickUsuario = sessionStorage.getItem("nickUsuario");

    const crearSala = () => {
        //creamos la nueva ruta en app.jsx
        navega("/crearSala")
    }

    const unirPartida = () => {
        //creamos la nueva ruta en app.jsx
        navega("/seleccionarSala")
    }

    // Redirige a la página de añadir cuestionarios que está en el otro puerto *** REVISAR SI NO VA ***
    const irACrearCuestionario = () => {
        window.location.href = "http://localhost:5173/cuestionarios";
    }

    useEffect(() => {
        console.log("el usuario es: " + nickUsuario)
    })
    
    return (
        <>
            <hr /><hr />
            <div>
                <h2>¡¡BIENVENIDO!!</h2>
            </div>
            <hr /><hr /><br />
            <button onClick={irACrearCuestionario} name="irACrearCuestionario" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginRight: "20px", marginTop: "10px" }} class="btn btn-outline-success">CREA CUESTIONARIO</button>
            <button onClick={crearSala} name="crearSala" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginRight: "20px", marginTop: "10px" }} class="btn btn-outline-primary">CREAR SALA</button>
            <button onClick={unirPartida} name="unirPartida" style={{ fontSize: "14px", borderRadius: "55px", width: "250px", height: "50px", padding: "5px", marginTop: "10px" }} class="btn btn-outline-danger">UNIRME A PARTIDA</button>
        </>
    )
}

export default PaginaInicial