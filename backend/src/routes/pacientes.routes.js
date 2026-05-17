const express = require('express');

const router = express.Router();

const {
  obtenerPacientes,
  obtenerPacientePorId,
  buscarPacientePorCorreo,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente
} = require('../controllers/pacientes.controller');

/*
|--------------------------------------------------------------------------
| Buscar paciente por correo
|--------------------------------------------------------------------------
*/

router.get(
  '/buscar',
  buscarPacientePorCorreo
);

/*
|--------------------------------------------------------------------------
| Obtener todos
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  obtenerPacientes
);

/*
|--------------------------------------------------------------------------
| Obtener por ID
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  obtenerPacientePorId
);

/*
|--------------------------------------------------------------------------
| Crear
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  crearPaciente
);

/*
|--------------------------------------------------------------------------
| Actualizar
|--------------------------------------------------------------------------
*/

router.put(
  '/:id',
  actualizarPaciente
);

/*
|--------------------------------------------------------------------------
| Eliminar
|--------------------------------------------------------------------------
*/

router.delete(
  '/:id',
  eliminarPaciente
);

module.exports = router;