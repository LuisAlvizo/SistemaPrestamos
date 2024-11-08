// src/Register.jsx
import React, { useState } from "react";
import { Card, Button, Row, Col, TextInput, Select } from "react-materialize";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Api/api";
import "../Css/Login.css";

function Register() {
  const [nombres, setNombres] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [rfc, setRfc] = useState("");
  const [edad, setEdad] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("Cliente");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validarRFC = (rfc) => {
    const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/;

    return (rfc.length === 12 || rfc.length === 13) && rfcRegex.test(rfc);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validarRFC(rfc)) {
      setMessage("RFC no válido. Verifique el formato e intente de nuevo.");
      return;
    }

    if (edad < 18) {
      setMessage("Debes tener al menos 18 años para registrarte.");
      return;
    }

    const userData = {
      nombres,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      rfc,
      edad,
      estado_civil: estadoCivil,
      telefono,
      correo,
      rol,
      password,
    };

    try {
      await registerUser(userData);
      setMessage("Usuario registrado con éxito");
      navigate("/login"); // Redirige al login después del registro
    } catch (error) {
      setMessage(
        "Error al registrar usuario: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  return (
    <Row className="center-align" style={{ marginTop: "5rem" }}>
      <Col s={12} m={8} l={4} offset="m2 l4">
        <Card
          className="z-depth-3"
          title={<span className="title">Registro de Usuario</span>}
          style={{ borderRadius: "10px", padding: "20px" }}
        >
          <br />
          <form onSubmit={handleRegister}>
            <TextInput
              label="Nombres"
              s={12}
              value={nombres}
              onChange={(e) => {
                const regex = /^[A-Za-zÀ-ÿ\s]*$/; // Permite solo letras y espacios
                if (regex.test(e.target.value)) setNombres(e.target.value);
              }}
              style={{ backgroundColor: "white", borderRadius: "8px" }}
              required
            />
            <TextInput
              label="Apellido Paterno"
              s={12}
              value={apellidoPaterno}
              onChange={(e) => {
                const regex = /^[A-Za-zÀ-ÿ\s]*$/; // Permite solo letras y espacios
                if (regex.test(e.target.value))
                  setApellidoPaterno(e.target.value);
              }}
              style={{ backgroundColor: "white", borderRadius: "8px" }}
              required
            />
            <TextInput
              label="Apellido Materno"
              s={12}
              value={apellidoMaterno}
              onChange={(e) => {
                const regex = /^[A-Za-zÀ-ÿ\s]*$/; // Permite solo letras y espacios
                if (regex.test(e.target.value))
                  setApellidoMaterno(e.target.value);
              }}
              style={{ backgroundColor: "white", borderRadius: "8px" }}
            />
            <TextInput
              label="RFC"
              s={12}
              F
              value={rfc}
              onChange={(e) => setRfc(e.target.value.slice(0, 13))}
              style={{ backgroundColor: "white", borderRadius: "8px" }}
              maxLength="13"
              required
            />
            <TextInput
              label="Edad"
              s={12}
              type="number"
              value={edad}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value >= 0) setEdad(value);
              }}
              style={{ backgroundColor: "white", borderRadius: "8px" }}
              required
            />
            <Select
              label="Estado Civil"
              s={12}
              value={estadoCivil}
              onChange={(e) => setEstadoCivil(e.target.value)}
              style={{ backgroundColor: "white", borderRadius: "8px" }}
              className="custom-select"
            >
              <option value="Solter@">Solter@</option>
              <option value="Casad@">Casad@</option>
              <option value="Viud@">Viud@</option>
              <option value="Divorciad@">Divorciad@</option>
            </Select>
            <TextInput
              label="Teléfono"
              s={12}
              type="tel"
              value={telefono}
              onChange={(e) => {
                const regex = /^[0-9\b]+$/; // Solo permite números
                if (regex.test(e.target.value))
                  setTelefono(e.target.value.slice(0, 10));
              }}
              style={{ backgroundColor: "white", borderRadius: "8px" }}
              maxLength="10"
            />
            <TextInput
              label="Correo"
              s={12}
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              style={{ backgroundColor: "white", borderRadius: "8px" }}
              required
            />
            <TextInput
              label="Contraseña"
              s={12}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ backgroundColor: "white", borderRadius: "8px" }}
              required
            />
            <Button
              className="blue darken-2"
              type="submit"
              style={{ width: "100%", marginTop: "20px", borderRadius: "8px" }}
            >
              Registrarse
            </Button>
          </form>
          {message && (
            <p
              style={{
                color: message.includes("éxito") ? "green" : "red",
                marginTop: "20px",
              }}
            >
              {message}
            </p>
          )}
          <Button
            className="grey lighten-1"
            onClick={() => navigate("/login")}
            style={{ width: "100%", marginTop: "10px", borderRadius: "8px" }}
          >
            Regresar
          </Button>
        </Card>
      </Col>
    </Row>
  );
}

export default Register;
