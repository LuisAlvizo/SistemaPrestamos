import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, TextInput } from 'react-materialize';
import { loginUser} from '../Api/api';

import '../Css/Login.css'

function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(correo, password);
      setMessage('Inicio de sesión exitoso');
      navigate('/home'); // Redirige a la página principal después de iniciar sesión
    } catch (error) {
      setMessage('Error al iniciar sesión: ' + (error.response?.data || error.message));
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Redirige a la página de registro
  };

  return (
    <Row className="center-align" style={{ marginTop: '5rem' }}>
      <Col s={12} m={8} l={4} offset="m2 l4">
        <Card
          className="z-depth-3"
          title={<span className="title">Iniciar Sesión</span>}
          style={{ borderRadius: '10px', padding: '20px' }}
        >
          <br />
          <form onSubmit={handleLogin}>
            <TextInput
              id="email"
              email
              label="Correo"
              s={12}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              style={{ backgroundColor: 'white', borderRadius: '8px' }}
              required
            />
            <TextInput
              id="password"
              password
              label="Contraseña"
              s={12}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ backgroundColor: 'white', borderRadius: '8px' }}
              required
            />
            <Button
              className="blue darken-2"
              type="submit"
              style={{ width: '100%', marginTop: '20px', borderRadius: '8px' }}
            >
              Iniciar sesión
            </Button>
          </form>
          {message && <p style={{ color: 'red', marginTop: '20px' }}>{message}</p>}
          
          <Button
            className="grey lighten-1"
            onClick={handleRegisterRedirect}
            style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }}
          >
            Registrarse
          </Button>
        </Card>
      </Col>
    </Row>
  );
}

export default Login;