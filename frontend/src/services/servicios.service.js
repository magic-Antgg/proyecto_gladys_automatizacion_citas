import api from './api';

export const obtenerServicios = async () => {

  const response = await api.get(
    '/servicios'
  );

  return response.data.data;
};