import api from './api';

/*
|--------------------------------------------------------------------------
| Crear paciente
|--------------------------------------------------------------------------
*/

export const crearPaciente =
  async (datos) => {

    const response =
      await api.post(
        '/pacientes',
        datos
      );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Buscar paciente por correo
|--------------------------------------------------------------------------
*/

export const buscarPacientePorCorreo =
  async (correo) => {

    const response =
      await api.get(
        `/pacientes/buscar?correo=${correo}`
      );

    return response.data.data;
};