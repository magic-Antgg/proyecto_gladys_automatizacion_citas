import api from './api';

export const buscarPacientePorCorreo = async (correo) => {
  const res = await api.get(
    `/pacientes/buscar?correo=${encodeURIComponent(correo)}`
  );
  return res.data.data;
};

export const crearPaciente = async (datos) => {
  const res = await api.post('/pacientes', datos);
  return res.data;
};