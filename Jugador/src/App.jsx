import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/darkly/bootstrap.min.css";
import { useEffect } from 'react';

import Principal from './paginas/paginaInicial';
import Seleccion from './paginas/paginaSeleccion';
import CrearSala from './paginas/crearSala';
import SeleccionError from './paginas/paginaAdminSeFue';
import JugarPartida from './paginas/jugarPartida';
import JugarPartidaAdmin from './paginas/jugarPartida_admin';
import Index from './paginas/inicioJugador';
import Puntuaciones from './paginas/puntuaciones';

import { io } from 'socket.io-client';
const socket = io("http://localhost:4001");

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/menu" element={<Principal />} />
          <Route path="/seleccionarSala" element={<Seleccion />} />
          <Route path="/crearSala" element={<CrearSala />} />
          <Route path="/sala/err" element={<SeleccionError />} />
          <Route path="/sala/:id" element={<JugarPartida />} />
          <Route path="/salaAdmin/:id"element={<JugarPartidaAdmin />} />
          <Route path="/puntuaciones/:id/:nC"element={<Puntuaciones />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
