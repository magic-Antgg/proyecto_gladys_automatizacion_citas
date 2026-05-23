const express = require('express');
const router = express.Router();

const {
  obtenerPacientes,
  buscarPacientePorCorreo,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente
} = require('../controllers/pacientes.controller');

// IMPORTANTE: /buscar debe ir ANTES de /:id
router.get('/buscar', buscarPacientePorCorreo);

router.get('/',       obtenerPacientes);
router.post('/',      crearPaciente);
router.put('/:id',    actualizarPaciente);
router.delete('/:id', eliminarPaciente);

module.exports = router;