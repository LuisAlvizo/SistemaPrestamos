// src/Componentes/Home.jsx
import '../Css/Home.css'

// src/Componentes/Home.jsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select } from '@mui/material';

const Home = () => {
  const [tipoCotizacion, setTipoCotizacion] = useState('montoCasa'); // Tipo de cotización
  const [montoCasa, setMontoCasa] = useState('');
  const [enganche, setEnganche] = useState('');
  const [plazo, setPlazo] = useState('');
  const [tasaInteres, setTasaInteres] = useState('');
  const [sueldoMensual, setSueldoMensual] = useState('');
  const [mensualidad, setMensualidad] = useState(null);
  const [montoTotal, setMontoTotal] = useState(null);
  const [montoPrestamo, setMontoPrestamo] = useState(null); // Estado para monto del préstamo
  const [montoMaxCasa, setMontoMaxCasa] = useState(null); // Estado para el monto máximo de la casa

  const calcularCotizacion = () => {
    let calculadoMontoPrestamo;
    let pagoMensual;
    const tasaMensual = tasaInteres / 100 / 12;
    const totalPagos = plazo * 12;

    if (tipoCotizacion === 'montoCasa') {
      // Calcular basado en el monto de la casa
      calculadoMontoPrestamo = montoCasa - (montoCasa * enganche / 100);
      pagoMensual = (calculadoMontoPrestamo * tasaMensual * Math.pow(1 + tasaMensual, totalPagos)) / (Math.pow(1 + tasaMensual, totalPagos) - 1);
      setMontoMaxCasa(null); // No se necesita el monto máximo de la casa en este caso
    } else if (tipoCotizacion === 'sueldo') {
      // Calcular basado en el sueldo (mensualidad <= 40% del sueldo mensual)
      const maxPagoMensual = sueldoMensual * 0.4;
      
      // Calcula el monto del préstamo posible antes del enganche
      const montoPrestamoAntesEnganche = (maxPagoMensual * (Math.pow(1 + tasaMensual, totalPagos) - 1)) / (tasaMensual * Math.pow(1 + tasaMensual, totalPagos));
      
      // Calcula el monto máximo de la casa aplicando el enganche
      const montoMaximoCasa = montoPrestamoAntesEnganche / (1 - enganche / 100);
      calculadoMontoPrestamo = montoMaximoCasa - (montoMaximoCasa * enganche / 100); // Aplica el enganche sobre el monto de la casa
      pagoMensual = maxPagoMensual;

      setMontoMaxCasa(montoMaximoCasa.toFixed(2)); // Almacena el monto máximo de la casa
    }

    const totalPagar = pagoMensual * totalPagos;

    setMensualidad(pagoMensual.toFixed(2));
    setMontoTotal(totalPagar.toFixed(2));
    setMontoPrestamo(calculadoMontoPrestamo.toFixed(2)); // Actualiza el monto del préstamo en el estado
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card className="card-rounded" sx={{ maxWidth: 800, padding: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom align="center">
            Cotización de Préstamo
          </Typography>

          {/* Selector de tipo de cotización */}
          <Select
            label="Tipo de Cotización"
            value={tipoCotizacion}
            onChange={(e) => setTipoCotizacion(e.target.value)}
            fullWidth
            variant="outlined"
            style={{ marginBottom: '20px' }}
          >
            <MenuItem value="montoCasa">Basado en Monto de Casa</MenuItem>
            <MenuItem value="sueldo">Basado en Sueldo</MenuItem>
          </Select>

          {/* Inputs de usuario según tipo de cotización */}
          {tipoCotizacion === 'montoCasa' ? (
            <>
              <TextField label="Monto de la Casa" variant="outlined" fullWidth margin="normal" type="number" value={montoCasa} onChange={(e) => setMontoCasa(e.target.value)} />
              <TextField label="Enganche (%)" variant="outlined" fullWidth margin="normal" type="number" value={enganche} onChange={(e) => setEnganche(e.target.value)} />
            </>
          ) : (
            <>
              <TextField label="Sueldo Mensual" variant="outlined" fullWidth margin="normal" type="number" value={sueldoMensual} onChange={(e) => setSueldoMensual(e.target.value)} />
              <TextField label="Enganche (%)" variant="outlined" fullWidth margin="normal" type="number" value={enganche} onChange={(e) => setEnganche(e.target.value)} />
            </>
          )}

          <TextField label="Plazo (Años)" variant="outlined" fullWidth margin="normal" type="number" value={plazo} onChange={(e) => setPlazo(e.target.value)} />
          <TextField label="Tasa de Interés Anual (%)" variant="outlined" fullWidth margin="normal" type="number" value={tasaInteres} onChange={(e) => setTasaInteres(e.target.value)} />

          <Button variant="contained" color="primary" onClick={calcularCotizacion} style={{ marginTop: '20px' }}>
            Calcular
          </Button>

          {/* Tabla de resultados */}
          {mensualidad && montoTotal && (
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Descripción</strong></TableCell>
                    <TableCell align="right"><strong>Valor</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tipoCotizacion === 'montoCasa' && (
                    <TableRow>
                      <TableCell>Monto de la Casa</TableCell>
                      <TableCell align="right">${parseFloat(montoCasa).toFixed(2)}</TableCell>
                    </TableRow>
                  )}
                  {tipoCotizacion === 'sueldo' && montoMaxCasa && (
                    <TableRow>
                      <TableCell>Monto Máximo de la Casa</TableCell>
                      <TableCell align="right">${montoMaxCasa}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell>Enganche</TableCell>
                    <TableCell align="right">{enganche}% (${(tipoCotizacion === 'montoCasa' ? montoCasa * enganche / 100 : montoMaxCasa * enganche / 100).toFixed(2)})</TableCell>
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
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;

