// src/Componentes/Perfil.jsx
import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent } from '@mui/material';

const Perfil = () => {
  const [userData, setUserData] = useState({
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    rol: '',
  });

  useEffect(() => {

    const rol = localStorage.getItem('rol');
    
    setUserData({ rol });
  }, []);

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 400, boxShadow: 3 }}>
        <CardContent>

          <Typography variant="body1" gutterBottom>
            <strong>Rol:</strong> {userData.rol}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Perfil;
