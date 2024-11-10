import axios from 'axios';

const adminId = localStorage.getItem("id_usuario");

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = (correo, password) => {
  return api.post('/login', { correo, password });
};

export const registerUser = (userData) => {
  return api.post('/register', userData);
};

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

export const deleteUser = (id) => api.delete(`/usuario/${id}/${adminId}`);

export const addBanco = (banco) => api.post(`/addbanco/${adminId}`, banco);

export const updateBanco = (id, banco) => api.put(`/editbanco/${id}/${adminId}`, banco);

export const deleteBanco = (id) => api.delete(`/deletebanco/${id}/${adminId}`);

export default api;
