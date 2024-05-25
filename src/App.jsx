import Navbar from './components/Navbar';
import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login'
import Protected from './components/Protected'
import Register from './components/Register'

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
        </Routes>
      </BrowserRouter>
    </div>
    
  );
}

export default App;