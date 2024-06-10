import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Protected from './components/Protected';
import Register from './components/Register';
import MisClases from './components/misclases';
import InvitacionClase from './components/InvitacionClase';
import NuevaClase from './components/NuevaClase';
import Clase from './components/Clase';
import FlowsClase from './components/FlowsClase';
import Participantes from './components/Participantes';
import JoinClass from './components/joinClass';
import SubirFlujo from './components/subirFlujo';
import MisFlows from './components/misflows';
import ModificarClase from "./components/modificarClase";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Aquí puedes agregar lógica adicional para verificar el token si es necesario
      // Por ejemplo, una llamada a tu backend para validar el token
      navigate('/protected');
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <h1>Home Page</h1>
    </div>
  );
}

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/protected' element={<Protected />} />
          <Route path='/register' element={<Register />} />
          <Route path='/invitacionClase/:classId' element={<InvitacionClase />} />
          <Route path='/nuevaClase' element={<NuevaClase />} />
          <Route path='/misClases' element={<MisClases />} />
          <Route path='/clase/:classId' element={<Clase />} />
          <Route path='/clase/:classId/modificar' element={<ModificarClase />} />
          <Route path="/clase/:classId/flowsClase" element={<FlowsClase />} />
          <Route path="/clase/:classId/subirFlujo" element={<SubirFlujo />} />
          <Route path="/clase/:classId/MisFlowsClase" element={<MisFlows />} />
          <Route path="/clase/:classId/participantes" element={<Participantes />} />
          <Route path="/join/:classId" element={<JoinClass />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
