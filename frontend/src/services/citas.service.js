import api from './api';

export const obtenerAgenda = async () => {
  const res = await api.get('/citas');
  return res.data;
};

export const crearCita = async (datos) => {
  const res = await api.post('/citas', datos);
  return res.data;
};

export const cancelarCita = async (id) => {
  const res = await api.patch(`/citas/${id}/cancelar`);
  return res.data;
};

export const reprogramarCita = async (id, datos) => {
  const res = await api.patch(`/citas/${id}/reprogramar`, datos);
  return res.data;
};