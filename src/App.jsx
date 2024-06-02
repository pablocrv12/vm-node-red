import Navbar from './components/Navbar';
import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Protected from './components/Protected';
import Register from './components/Register';
import InvitacionClase from './components/InvitacionClase';
import NuevaClase from './components/NuevaClase';
import MisClases from './components/MisClases';
import Clase from './components/Clase';
import FlowsClase from './components/FlowsClase';
import Participantes from './components/Participantes';
import JoinClass from './components/joinClass';

const App = () => {

  const Home = () => {
    return (
      <div>
        <Navbar></Navbar>
        <h1>Home Page</h1>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/protected' element={<Protected />} />
          <Route path='/register' element={<Register />} /> {/* Añadir ruta para registro */}
          <Route path='/invitacionClase/:classId' element={<InvitacionClase />} /> {/* Añadir ruta para registro */}
          <Route path='/nuevaClase' element={<NuevaClase />} /> {/* Añadir ruta para registro */}
          <Route path='/misClases' element={<MisClases />} /> {/* Añadir ruta para registro */}
          <Route path='/clase/:classId' element={<Clase />} /> {/* Añadir ruta para registro */}
          <Route path="/clase/:classId/flows" element={<FlowsClase />} /> {/* Añade esta línea */}
          <Route path="/clase/:classId/participantes" element={<Participantes />} /> {/* Añade esta línea */}
          <Route path="/join/:classId" element={<JoinClass />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;