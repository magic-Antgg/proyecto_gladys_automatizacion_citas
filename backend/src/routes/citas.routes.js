const express = require('express');

const router = express.Router();

const citasController =

require('../controllers/citas.controller');

/*
|--------------------------------------------------------------------------
| Crear cita
|--------------------------------------------------------------------------
*/
router.get('/', citasController.obtenerAgenda);

router.patch(
  '/:id/cancelar',
  citasController.cancelarCita
);

router.patch(
  '/:id/reprogramar',
  citasController.reprogramarCita
);

router.post('/', citasController.crearCita);

module.exports = router;