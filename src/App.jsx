// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from '../src/Login/Login';
import Register from '../src/Login/Register';
import Navbar from '../src/navbar/navbar';
import Home from '../src/Componentes/Home';
import Historial from '../src/Componentes/Historial';
import Configuracion from '../src/Componentes/Configuracion';

function App() {
  const location = useLocation(); // Obtiene la ruta actual
  const isAuthenticated = true; // Cambia esto según el estado real de autenticación

  // Verifica si la ruta actual es "/" o una ruta de autenticación
  const hideNavbar = ["/", "/login", "/Login", "/register"].includes(location.pathname);

  return (
    <div style={{ display: 'flex' }}>
      {/* Renderiza el Navbar solo si no estás en las rutas de login o register */}
      {isAuthenticated && !hideNavbar && <Navbar />}
      <div style={{ flex: 1, marginLeft: isAuthenticated && !hideNavbar ? '200px' : '0', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas protegidas */}
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/historial" element={isAuthenticated ? <Historial /> : <Navigate to="/historial" />} />
          <Route path="/configuracion" element={isAuthenticated ? <Configuracion /> : <Navigate to="/configuracion" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
