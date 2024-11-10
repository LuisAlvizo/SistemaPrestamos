// src/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const rol = localStorage.getItem("rol");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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
          <span onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </span>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
