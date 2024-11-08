// src/Componentes/Configuracion.jsx
import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Card, CardContent, CardActions, List, ListItem, ListItemText } from '@mui/material';
import Swal from 'sweetalert2';
import { getUsuarios, getBancos, deleteUser, addBanco, updateBanco, deleteBanco } from '../Api/api';

const Configuracion = () => {
  const rol = localStorage.getItem('rol');
  const [usuarios, setUsuarios] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [newBanco, setNewBanco] = useState({ nombre: '', tasa_interes: '', years: '' });

  useEffect(() => {
    if (rol === 'Administrador') {
      getUsuarios()
        .then((response) => {
          setUsuarios(Array.isArray(response.data) ? response.data : []);
        })
        .catch((error) => {
          console.error("Error al obtener usuarios:", error);
          setUsuarios([]); 
        });
  
      getBancos()
        .then((response) => setBancos(Array.isArray(response.data) ? response.data : []))
        .catch((error) => {
          console.error("Error al obtener bancos:", error);
          setBancos([]); 
        });
    }
  }, [rol]);
  
  if (rol !== 'Administrador') {
    return <Typography>No tienes acceso a esta sección.</Typography>;
  }

  const handleDeleteUser = (userId) => {
    deleteUser(userId)
      .then(() => {
        setUsuarios(usuarios.filter((user) => user.id_usuario !== userId));
        Swal.fire("Eliminado", "El usuario ha sido eliminado exitosamente", "success");
      })
      .catch(() => Swal.fire("Error", "No se pudo eliminar el usuario", "error"));
  };

  const handleAddBanco = () => {
    addBanco(newBanco)
      .then((response) => {
        setBancos([...bancos, response.data]);
        Swal.fire("Agregado", "El banco ha sido agregado exitosamente", "success");
        setNewBanco({ nombre: '', tasa_interes: '', years: '' });
      })
      .catch(() => Swal.fire("Error", "No se pudo agregar el banco", "error"));
  };

  const handleUpdateBanco = (bancoId, updatedBanco) => {
    updateBanco(bancoId, updatedBanco)
      .then(() => {
        setBancos(bancos.map(banco => banco.id_banco === bancoId ? { ...updatedBanco, id_banco: bancoId } : banco));
        Swal.fire("Actualizado", "El banco ha sido actualizado exitosamente", "success");
      })
      .catch(() => Swal.fire("Error", "No se pudo actualizar el banco", "error"));
  };

  const handleDeleteBanco = (bancoId) => {
    deleteBanco(bancoId)
      .then(() => {
        setBancos(bancos.filter((banco) => banco.id_banco !== bancoId));
        Swal.fire("Eliminado", "El banco ha sido eliminado exitosamente", "success");
      })
      .catch(() => Swal.fire("Error", "No se pudo eliminar el banco", "error"));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card sx={{ maxWidth: 800, margin: 'auto', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center">Configuración</Typography>

          <Typography variant="h5" mt={2}>Gestión de Usuarios</Typography>
          <List>
            {usuarios.map((user) => (
              <ListItem key={user.id_usuario}>
                <ListItemText primary={user.nombres} secondary={user.correo} />
                <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(user.id_usuario)}>
                  Eliminar Usuario
                </Button>
              </ListItem>
            ))}
          </List>

          <Typography variant="h5" mt={2}>Gestión de Bancos</Typography>
          <List>
            {bancos.map((banco) => (
              <ListItem key={banco.id_banco}>
                <ListItemText primary={banco.nombre} secondary={`Tasa: ${banco.tasa_interes}% - Plazos: ${banco.years.join(', ')} años`} />
                <Button variant="contained" color="primary" onClick={() => handleUpdateBanco(banco.id_banco, banco)}>
                  Modificar Banco
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteBanco(banco.id_banco)}>
                  Eliminar Banco
                </Button>
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" mt={2}>Agregar Nuevo Banco</Typography>
          <TextField
            label="Nombre del Banco"
            fullWidth
            margin="normal"
            value={newBanco.nombre}
            onChange={(e) => setNewBanco({ ...newBanco, nombre: e.target.value })}
          />
          <TextField
            label="Tasa de Interés (%)"
            fullWidth
            margin="normal"
            type="number"
            value={newBanco.tasa_interes}
            onChange={(e) => setNewBanco({ ...newBanco, tasa_interes: e.target.value })}
          />
          <TextField
            label="Plazos (Años)"
            fullWidth
            margin="normal"
            value={newBanco.years}
            onChange={(e) => setNewBanco({ ...newBanco, years: e.target.value })}
            helperText="Ingrese los plazos separados por comas (por ejemplo, 10,15,20)"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddBanco}
            style={{ marginTop: '10px' }}
          >
            Agregar Banco
          </Button>
        </CardContent>
        <CardActions>
          <Typography variant="body2" color="textSecondary" align="center" style={{ width: '100%', padding: '10px' }}>
            Solo el administrador puede realizar cambios en esta sección.
          </Typography>
        </CardActions>
      </Card>
    </div>
  );
};

export default Configuracion;
