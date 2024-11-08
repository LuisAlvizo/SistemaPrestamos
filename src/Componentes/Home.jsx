// src/Componentes/Home.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Swal from "sweetalert2";
import { getBancos, saveCotizacion } from "../Api/api";

const Home = () => {
  const [bancos, setBancos] = useState([]);
  const [selectedBanco, setSelectedBanco] = useState(null);
  const [tipoCotizacion, setTipoCotizacion] = useState("montoCasa");
  const [montoCasa, setMontoCasa] = useState("");
  const [enganche, setEnganche] = useState("");
  const [plazo, setPlazo] = useState("");
  const [tasaInteres, setTasaInteres] = useState("");
  const [sueldoMensual, setSueldoMensual] = useState("");
  const [mensualidad, setMensualidad] = useState(null);
  const [montoTotal, setMontoTotal] = useState(null);
  const [montoPrestamo, setMontoPrestamo] = useState(null);
  const [montoMaxCasa, setMontoMaxCasa] = useState(null);

  useEffect(() => {
    getBancos()
      .then((response) => setBancos(response.data))
      .catch((error) => console.error("Error al obtener los bancos:", error));
  }, []);

  const handleSaveCotizacion = async () => {
    const id_usuario = localStorage.getItem("id_usuario");

    if (!id_usuario) {
      Swal.fire("Error", "Usuario no autenticado", "error");
      return;
    }

    const cotizacionData = {
      monto_casa: tipoCotizacion === "sueldo" ? parseFloat(montoMaxCasa) : parseFloat(montoCasa),
      monto_credito: parseFloat(montoPrestamo),
      mensualidad: parseFloat(mensualidad),
      tipo_cotizacion: tipoCotizacion === "montoCasa" ? "Monto de Casa" : "Sueldo",
      monto_total: parseFloat(montoTotal),
      sueldo_mensual: tipoCotizacion === "sueldo" ? parseFloat(sueldoMensual) : null,
      year: parseInt(plazo),
      id_banco: selectedBanco.id_banco,
      id_usuario: parseInt(id_usuario),
    };
    

    try {
      const response = await saveCotizacion(cotizacionData);
      Swal.fire("Éxito", "Cotización guardada exitosamente", "success");
      console.log("Cotización guardada:", response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar la cotización", "error");
      console.error("Error al guardar la cotización:", error.message);
    }
  };
  const handleBancoChange = (event) => {
    const bancoId = event.target.value;
    const bancoSeleccionado = bancos.find(
      (banco) => banco.id_banco === bancoId
    );
    setSelectedBanco(bancoSeleccionado);
    setEnganche(bancoSeleccionado.enganche);
    setPlazo("");
    setTasaInteres(bancoSeleccionado.tasa_interes);
  };

  const handleCotizacionChange = (event) => {
    setTipoCotizacion(event.target.value);
    setMontoCasa("");
    setSueldoMensual("");
    setMensualidad(null);
    setMontoTotal(null);
    setMontoPrestamo(null);
    setMontoMaxCasa(null);
  };

  const calcularCotizacion = () => {
    // Verificar que todos los campos requeridos estén llenos
    if (!selectedBanco || !plazo || (!montoCasa && !sueldoMensual)) {
      Swal.fire(
        "Error",
        "Por favor, completa todos los campos antes de calcular.",
        "error"
      );
      return;
    }

    let calculadoMontoPrestamo;
    let pagoMensual;
    const tasaMensual = tasaInteres / 100 / 12;
    const totalPagos = plazo * 12;

    if (tipoCotizacion === "montoCasa") {
      // Validación para valores negativos en "Monto de la Casa"
      if (montoCasa <= 0) {
        Swal.fire(
          "Error",
          "El monto de la casa debe ser un valor positivo.",
          "error"
        );
        return;
      }

      calculadoMontoPrestamo = montoCasa - (montoCasa * enganche) / 100;

      // Validación para Infonavit
      if (
        selectedBanco.nombre === "Infonavit" &&
        calculadoMontoPrestamo > 2000000
      ) {
        Swal.fire(
          "Error",
          "Infonavit no permite préstamos mayores a 2 millones.",
          "error"
        );
        return;
      }

      pagoMensual =
        (calculadoMontoPrestamo *
          tasaMensual *
          Math.pow(1 + tasaMensual, totalPagos)) /
        (Math.pow(1 + tasaMensual, totalPagos) - 1);
      setMontoMaxCasa(null);
    } else if (tipoCotizacion === "sueldo") {
      const maxPagoMensual = sueldoMensual * 0.4;
      const montoPrestamoAntesEnganche =
        (maxPagoMensual * (Math.pow(1 + tasaMensual, totalPagos) - 1)) /
        (tasaMensual * Math.pow(1 + tasaMensual, totalPagos));
      const montoMaximoCasa = montoPrestamoAntesEnganche / (1 - enganche / 100);
      calculadoMontoPrestamo =
        montoMaximoCasa - (montoMaximoCasa * enganche) / 100;
      pagoMensual = maxPagoMensual;

      if (selectedBanco.nombre === "Infonavit" && montoMaximoCasa > 2000000) {
        Swal.fire(
          "Error",
          "Infonavit no permite préstamos mayores a 2 millones.",
          "error"
        );
        return;
      }

      setMontoMaxCasa(montoMaximoCasa.toFixed(2));
    }

    const totalPagar = pagoMensual * totalPagos;
    setMensualidad(pagoMensual.toFixed(2));
    setMontoTotal(totalPagar.toFixed(2));
    setMontoPrestamo(calculadoMontoPrestamo.toFixed(2));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Card
        className="card-rounded"
        sx={{ maxWidth: 800, padding: 3, boxShadow: 3 }}
      >
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom align="center">
            Cotización de Préstamo
          </Typography>

          {/* Tipo de cotización */}
          <Select
            label="Tipo de Cotización"
            value={tipoCotizacion}
            onChange={handleCotizacionChange}
            fullWidth
            variant="outlined"
            style={{ marginBottom: "20px" }}
          >
            <MenuItem value="montoCasa">Basado en Monto de Casa</MenuItem>
            <MenuItem value="sueldo">Basado en Sueldo</MenuItem>
          </Select>

          {tipoCotizacion === "montoCasa" ? (
            <TextField
              label="Monto de la Casa"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={montoCasa}
              onChange={(e) =>
                setMontoCasa(e.target.value < 0 ? "" : e.target.value)
              }
              InputProps={{
                sx: { paddingLeft: "10px" },
              }}
            />
          ) : (
            <TextField
              label="Sueldo Mensual"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={sueldoMensual}
              onChange={(e) =>
                setSueldoMensual(e.target.value < 0 ? "" : e.target.value)
              }
              InputProps={{
                sx: { paddingLeft: "10px" },
              }}
            />
          )}

          {/* Selector de banco */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Banco</InputLabel>
            <Select
              value={selectedBanco ? selectedBanco.id_banco : ""}
              onChange={handleBancoChange}
              label="Banco"
            >
              {bancos.map((banco) => (
                <MenuItem key={banco.id_banco} value={banco.id_banco}>
                  {banco.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Enganche (%)"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={enganche}
            InputProps={{
              readOnly: true,
              sx: { paddingLeft: "10px" },
            }}
          />

          <TextField
            label="Tasa de Interés Anual (%)"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={tasaInteres}
            InputProps={{
              readOnly: true,
              sx: { paddingLeft: "10px" },
            }}
          />

          {selectedBanco && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Plazo</InputLabel>
              <Select
                value={plazo}
                onChange={(e) => setPlazo(e.target.value)}
                label="Plazo"
              >
                {selectedBanco.years.map((year, index) => (
                  <MenuItem key={index} value={year}>
                    {year} años
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={calcularCotizacion}
            style={{ marginTop: "20px" }}
          >
            Calcular
          </Button>

          {/* Tabla de resultados */}
          {mensualidad && montoTotal && (
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Descripción</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Valor</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tipoCotizacion === "montoCasa" && (
                    <TableRow>
                      <TableCell>Monto de la Casa</TableCell>
                      <TableCell align="right">
                        ${parseFloat(montoCasa).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  {tipoCotizacion === "sueldo" && montoMaxCasa && (
                    <TableRow>
                      <TableCell>Monto Máximo de la Casa</TableCell>
                      <TableCell align="right">${montoMaxCasa}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell>Enganche</TableCell>
                    <TableCell align="right">
                      {enganche}% ($
                      {(tipoCotizacion === "montoCasa"
                        ? (montoCasa * enganche) / 100
                        : (montoMaxCasa * enganche) / 100
                      ).toFixed(2)}
                      )
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Monto del Crédito</TableCell>
                    <TableCell align="right">${montoPrestamo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Años</TableCell>
                    <TableCell align="right">{plazo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Interés</TableCell>
                    <TableCell align="right">{tasaInteres}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mensualidad</TableCell>
                    <TableCell align="right">${mensualidad}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Monto Total a Pagar</TableCell>
                    <TableCell align="right">${montoTotal}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <br></br>
                        <Button
                variant="contained"
                color="primary"
                onClick={handleSaveCotizacion}
              >
                Guardar Cotización
              </Button>
            </TableContainer>
            
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
