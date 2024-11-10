// src/Componentes/Configuracion.jsx
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Swal from "sweetalert2";
import {
  getUsuarios,
  getBancos,
  deleteUser,
  addBanco,
  updateBanco,
  deleteBanco,
} from "../Api/api";

const Configuracion = () => {
  const rol = localStorage.getItem("rol");
  const adminId = localStorage.getItem("id_usuario"); // Obtener ID de usuario admin del localStorage
  const [usuarios, setUsuarios] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [newBanco, setNewBanco] = useState({
    nombre: "",
    tasa_interes: "",
    years: "",
    enganche: "",
  }); // Agregar 'enganche'
  const [isEditing, setIsEditing] = useState(false);
  const [currentBancoId, setCurrentBancoId] = useState(null);

  useEffect(() => {
    if (rol === "Administrador") {
      getUsuarios()
        .then((response) => {
          setUsuarios(Array.isArray(response.data) ? response.data : []);
        })
        .catch((error) => {
          console.error("Error al obtener usuarios:", error);
          setUsuarios([]);
        });

      getBancos()
        .then((response) =>
          setBancos(Array.isArray(response.data) ? response.data : [])
        )
        .catch((error) => {
          console.error("Error al obtener bancos:", error);
          setBancos([]);
        });
    }
  }, [rol]);

  if (rol !== "Administrador") {
    return <Typography>No tienes acceso a esta sección.</Typography>;
  }

  const handleDeleteUser = (userId) => {
    deleteUser(userId, adminId)
      .then(() => {
        setUsuarios(usuarios.filter((user) => user.id_usuario !== userId));
        Swal.fire(
          "Eliminado",
          "El usuario ha sido eliminado exitosamente",
          "success"
        );
      })
      .catch(() =>
        Swal.fire("Error", "No se pudo eliminar el usuario", "error")
      );
  };

  const handleAddOrUpdateBanco = () => {
    const action = isEditing
      ? updateBanco(currentBancoId, newBanco, adminId)
      : addBanco(newBanco);
    
    action
      .then((response) => {
        const bancoData = {
          id_banco: isEditing ? currentBancoId : response.data.id_banco,
          nombre: newBanco.nombre,
          tasa_interes: newBanco.tasa_interes || 0,
          enganche: newBanco.enganche || 0,
          years: newBanco.years ? newBanco.years.split(',').map(Number) : [],
        };

        setBancos(
          isEditing
            ? bancos.map((banco) =>
                banco.id_banco === currentBancoId ? bancoData : banco
              )
            : [...bancos, bancoData]
        );
        
        Swal.fire(
          isEditing ? "Actualizado" : "Agregado",
          `El banco ha sido ${isEditing ? "actualizado" : "agregado"} exitosamente`,
          "success"
        );
        resetForm();
      })
      .catch(() =>
        Swal.fire(
          "Error",
          `No se pudo ${isEditing ? "actualizar" : "agregar"} el banco`,
          "error"
        )
      );
  };

  const handleEditBanco = (banco) => {
    setIsEditing(true);
    setCurrentBancoId(banco.id_banco);
    setNewBanco({
      nombre: banco.nombre,
      tasa_interes: banco.tasa_interes,
      enganche: banco.enganche,
      years: banco.years ? banco.years.join(",") : "",
    });
  };

  const handleDeleteBanco = (bancoId) => {
    if (!bancoId || !adminId) {
      Swal.fire("Error", "ID de banco o de administrador no definido", "error");
      return;
    }
  
    deleteBanco(bancoId, adminId) // Enviar adminId en la solicitud
      .then(() => {
        setBancos(bancos.filter((banco) => banco.id_banco !== bancoId));
        Swal.fire(
          "Eliminado",
          "El banco ha sido eliminado exitosamente",
          "success"
        );
      })
      .catch(() => Swal.fire("Error", "No se pudo eliminar el banco", "error"));
  };
  

  const resetForm = () => {
    setNewBanco({ nombre: "", tasa_interes: "", years: "", enganche: "" });
    setIsEditing(false);
    setCurrentBancoId(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Card sx={{ maxWidth: 800, margin: "auto", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center">
            Configuración
          </Typography>

          <Typography variant="h5" mt={2}>
            Gestión de Usuarios
          </Typography>
          <List>
            {usuarios.map((user) => (
              <ListItem key={user.id_usuario}>
                <ListItemText primary={user.nombres} secondary={user.correo} />
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteUser(user.id_usuario)}
                >
                  Eliminar Usuario
                </Button>
              </ListItem>
            ))}
          </List>

          <Typography variant="h5" mt={2}>
            Gestión de Bancos
          </Typography>
          <List>
            {bancos.map((banco) => (
              <ListItem key={banco.id_banco}>
                <ListItemText
                  primary={banco.nombre}
                  secondary={`Tasa: ${banco.tasa_interes}% - Enganche: ${
                    banco.enganche
                  }% - Plazos: ${
                    Array.isArray(banco.years)
                      ? banco.years.join(", ")
                      : "No disponible"
                  } años`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditBanco(banco)}
                >
                  Modificar Banco
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteBanco(banco.id_banco)}
                >
                  Eliminar Banco
                </Button>
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" mt={2}>
            {isEditing ? "Modificar Banco" : "Agregar Nuevo Banco"}
          </Typography>
          <TextField
            label="Nombre del Banco"
            fullWidth
            margin="normal"
            value={newBanco.nombre}
            onChange={(e) =>
              setNewBanco({ ...newBanco, nombre: e.target.value })
            }
          />
          <TextField
            label="Tasa de Interés (%)"
            fullWidth
            margin="normal"
            type="number"
            value={newBanco.tasa_interes}
            onChange={(e) =>
              setNewBanco({ ...newBanco, tasa_interes: e.target.value })
            }
          />
          <TextField
            label="Enganche (%)"
            fullWidth
            margin="normal"
            type="number"
            value={newBanco.enganche}
            onChange={(e) =>
              setNewBanco({ ...newBanco, enganche: e.target.value })
            }
          />
          <TextField
            label="Plazos (Años)"
            fullWidth
            margin="normal"
            value={newBanco.years}
            onChange={(e) =>
              setNewBanco({ ...newBanco, years: e.target.value })
            }
            helperText="Ingrese los plazos separados por comas (por ejemplo, 10,15,20)"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddOrUpdateBanco}
            style={{ marginTop: "10px" }}
          >
            {isEditing ? "Guardar Cambios" : "Agregar Banco"}
          </Button>
          {isEditing && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetForm}
              style={{ marginTop: "10px", marginLeft: "10px" }}
            >
              Cancelar
            </Button>
          )}
        </CardContent>
        <CardActions>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            style={{ width: "100%", padding: "10px" }}
          >
            Solo el administrador puede realizar cambios en esta sección.
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            style={{ width: "100%", padding: "10px" }}
          >
            Nota: Para eliminar un banco recien agregado debes actualizar la página primero.
          </Typography>
        </CardActions>
      </Card>
    </div>
  );
};

export default Configuracion;
