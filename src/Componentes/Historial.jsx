// src/Componentes/Historial.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import Swal from "sweetalert2";
import { getCotizaciones } from "../Api/api"; // Asegúrate de tener esta función en tu archivo API

const Historial = () => {
  const [cotizaciones, setCotizaciones] = useState({});
  const id_usuario = localStorage.getItem("id_usuario");

  useEffect(() => {
    if (id_usuario) {
      getCotizaciones(id_usuario)
        .then((response) => setCotizaciones(response.data))
        .catch((error) =>
          Swal.fire("Error", "No se pudo cargar el historial de cotizaciones.", "error")
        );
    }
  }, [id_usuario]);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <Card sx={{ width: "100%", maxWidth: 1000, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom align="center">
            Historial de Cotizaciones
          </Typography>
          {Object.entries(cotizaciones).map(([fecha, cotizacionesPorFecha], index) => (
            <div key={index} style={{ marginTop: "20px" }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Fecha: {fecha}
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Banco</strong></TableCell>
                      <TableCell><strong>Tipo de Cotización</strong></TableCell>
                      <TableCell align="right"><strong>Monto de la Casa</strong></TableCell>
                      <TableCell align="right"><strong>Monto del Crédito</strong></TableCell>
                      <TableCell align="right"><strong>Mensualidad</strong></TableCell>
                      <TableCell align="right"><strong>Plazo (Años)</strong></TableCell>
                      <TableCell align="right"><strong>Tasa de Interés</strong></TableCell>
                      <TableCell align="right"><strong>Enganche</strong></TableCell>
                      <TableCell align="right"><strong>Monto Total</strong></TableCell>
                      <TableCell align="right"><strong>Sueldo Mensual</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cotizacionesPorFecha.map((cotizacion) => (
                      <TableRow key={cotizacion.id_cotizacion}>
                        <TableCell>{cotizacion.banco.nombre}</TableCell>
                        <TableCell>{cotizacion.tipo_cotizacion}</TableCell>
                        <TableCell align="right">${parseFloat(cotizacion.monto_casa).toFixed(2)}</TableCell>
                        <TableCell align="right">${parseFloat(cotizacion.monto_credito).toFixed(2)}</TableCell>
                        <TableCell align="right">${parseFloat(cotizacion.mensualidad).toFixed(2)}</TableCell>
                        <TableCell align="right">{cotizacion.years} años</TableCell>
                        <TableCell align="right">{cotizacion.banco.tasa_interes}%</TableCell>
                        <TableCell align="right">{cotizacion.banco.enganche}%</TableCell>
                        <TableCell align="right">${parseFloat(cotizacion.monto_total).toFixed(2)}</TableCell>
                        <TableCell align="right">
                          {cotizacion.sueldo_mensual ? `$${parseFloat(cotizacion.sueldo_mensual).toFixed(2)}` : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Tarjeta debajo de cada tabla */}
              <Card sx={{ marginTop: 2, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="body1" color="textSecondary">
                    Resumen de cotizaciones guardadas para el {fecha}.
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total de cotizaciones en esta fecha: {cotizacionesPorFecha.length}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Historial;
