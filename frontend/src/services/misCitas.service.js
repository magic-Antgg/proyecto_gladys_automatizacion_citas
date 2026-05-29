import api from './api';

export const obtenerMisCitas = async (usuarioId) => {
  const res = await api.get(`/citas/mis-citas/${usuarioId}`);
  return res.data;
};

export const cancelarMiCita = async (citaId) => {
  const res = await api.patch(`/citas/${citaId}/cancelar`);
  return res.data;
};