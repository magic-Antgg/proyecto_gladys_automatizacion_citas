const express = require('express');

const router = express.Router();

const citasController =
require('../controllers/citas.controller');

/*
|--------------------------------------------------------------------------
| Obtener agenda
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  citasController.obtenerAgenda
);

/*
|--------------------------------------------------------------------------
| Mis citas del usuario
|--------------------------------------------------------------------------
*/

router.get(
  '/mis-citas/:usuario_id',
  citasController.obtenerMisCitas
);

/*
|--------------------------------------------------------------------------
| Cancelar cita
|--------------------------------------------------------------------------
*/

router.patch(
  '/:id/cancelar',
  citasController.cancelarCita
);

/*
|--------------------------------------------------------------------------
| Reprogramar cita
|--------------------------------------------------------------------------
*/

router.patch(
  '/:id/reprogramar',
  citasController.reprogramarCita
);

/*
|--------------------------------------------------------------------------
| Crear cita
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  citasController.crearCita
);

module.exports = router;