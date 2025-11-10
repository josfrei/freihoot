import React, { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { io } from 'socket.io-client';

const socket = io("http://localhost:4001");

const Partida = () => {

    const navega = useNavigate()
    var nickUsuario = sessionStorage.getItem("nickUsuario");


    return (
        <>
            <hr /><hr />
            <div>
                <h2>PARTIDA</h2>
            </div>
            <hr /><hr /><br />

            <div><h1>PREGUNTA</h1>
                <div id="opciones">

                </div>
            </div>
            <hr /><hr /><br />

        </>
    )

}
export default Partida
