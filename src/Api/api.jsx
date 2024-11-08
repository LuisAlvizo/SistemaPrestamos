// src/api.js
import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: 'http://localhost:3000', // Cambia esto si la URL de tu backend cambia
  headers: {
    'Content-Type': 'application/json',
  },
});

// Petición para iniciar sesión
export const loginUser = (correo, password) => {
  return api.post('/login', { correo, password });
};

// Petición para registrar un usuario
export const registerUser = (userData) => {
  return api.post('/register', userData);
};

// Petición para obtener la lista de bancos
export const getBancos = () => {
  return api.get('/bancos');
};

export const saveCotizacion = (cotizacionData) => {
  return api.post("/savecotizacion", cotizacionData);
};

export const getCotizaciones = (id_usuario) => {
  return api.get(`/cotizaciones/${id_usuario}`);
};

export const getUsuarios = () => api.get('/usuarios');
export const deleteUser = (id) => api.delete(`/usuario/${id}`);
export const addBanco = (banco) => api.post('/addbanco', banco);
export const updateBanco = (id, banco) => api.put(`/editbanco/${id}`, banco);
export const deleteBanco = (id) => api.delete(`/deletebanco/${id}`);

// Exportar la instancia de Axios para otras peticiones personalizadas
export default api;
