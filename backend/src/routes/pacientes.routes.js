const express = require('express');

const router = express.Router();

const {
  obtenerPacientes,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente
} = require('../controllers/pacientes.controller');

/*
|--------------------------------------------------
| Obtener pacientes
|--------------------------------------------------
*/

router.get(
  '/',
  obtenerPacientes
);

/*
|--------------------------------------------------
| Crear paciente
|--------------------------------------------------
*/

router.post(
  '/',
  crearPaciente
);

/*
|--------------------------------------------------
| Actualizar paciente
|--------------------------------------------------
*/

router.put(
  '/:id',
  actualizarPaciente
);

/*
|--------------------------------------------------
| Eliminar paciente
|--------------------------------------------------
*/

router.delete(
  '/:id',
  eliminarPaciente
);

module.exports = router;