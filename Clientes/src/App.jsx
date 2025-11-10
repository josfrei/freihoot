import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/vapor/bootstrap.min.css";
import Cuestionarios from './paginas/cuestionarios'
import FormularioCuestionarios from './paginas/formularioCuestionario'
import FormularioCuestionariosEditar from './paginas/formularioCuestionarioEditar'
import AnadirPreguntas from './paginas/preguntasAnadir'
import EditarPreguntas from './paginas/preguntasEditar'
import EditarOpciones from './paginas/opcionesEditar'
import AnadirOpciones from './paginas/opcionesAnadir'
import Opciones from './paginas/opciones'
import Preguntas from './paginas/preguntas'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/cuestionarios" element={<Cuestionarios />} />
          <Route path="/formularioCuestionario" element={<FormularioCuestionarios />} />
          <Route path="/formularioCuestionarioEditar/:id" element={<FormularioCuestionariosEditar />} />
          <Route path="/preguntasAnadir/:id" element={<AnadirPreguntas />} />
          <Route path="/preguntasEditar/:id" element={<EditarPreguntas />} />
          <Route path="/opcionesEditar/:id" element={<EditarOpciones />} />
          <Route path="/opcionesAnadir/:id" element={<AnadirOpciones />} />
          <Route path="/opciones/:id" element={<Opciones />} />
          <Route path="/preguntas/:id" element={<Preguntas />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
