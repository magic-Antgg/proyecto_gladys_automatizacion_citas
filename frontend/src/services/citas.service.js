import api from './api';

/*
|--------------------------------------------------------------------------
| Obtener agenda
|--------------------------------------------------------------------------
*/

export const obtenerAgenda = async () => {

  const respuesta = await api.get('/citas');

  return respuesta.data.data;
};

/*
|--------------------------------------------------------------------------
| Crear cita
|--------------------------------------------------------------------------
*/

export const crearCita = async (datos) => {

  const respuesta = await api.post(
    '/citas',
    datos
  );

  return respuesta.data;
};

/*
|--------------------------------------------------------------------------
| Cancelar cita
|--------------------------------------------------------------------------
*/

export const cancelarCita = async (id) => {

  const respuesta = await api.patch(
    `/citas/${id}/cancelar`
  );

  return respuesta.data;
};

/*
|--------------------------------------------------------------------------
| Reprogramar cita
|--------------------------------------------------------------------------
*/

export const reprogramarCita = async (
  id,
  datos
) => {

  const respuesta = await api.patch(
    `/citas/${id}/reprogramar`,
    datos
  );

  return respuesta.data;
};