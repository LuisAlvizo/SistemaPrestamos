// src/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const rol = localStorage.getItem("rol");

  return (
    <div className="navbar">
      <h2 className="navbar-title">Menú</h2>
      <ul className="navbar-links">
        <li>
          <Link to="/home">Inicio</Link>
        </li>
        <li>
          <Link to="/historial">Historial</Link>
        </li>
        <li>
          <Link to="/profile">Perfil</Link>
        </li>
        {rol === "Administrador" && (
          <li>
            <Link to="/configuracion">Configuración</Link>
          </li>
        )}
        <li>
          <Link to="/help">Ayuda</Link>
        </li>
        <li>
          <Link to="/logout">Cerrar Sesión</Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
