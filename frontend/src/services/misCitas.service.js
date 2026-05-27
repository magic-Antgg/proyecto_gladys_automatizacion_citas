import api from './api';

export const obtenerMisCitas = async (
  usuarioId
) => {

  const response =
    await api.get(
      `/citas/mis-citas/${usuarioId}`
    );

  return response.data;

};