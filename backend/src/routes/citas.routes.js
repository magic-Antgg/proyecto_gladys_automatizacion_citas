const express = require('express');
const router  = express.Router();
const citasController = require('../controllers/citas.controller');

// IMPORTANTE: rutas específicas ANTES de /:id
router.get('/',                          citasController.obtenerAgenda);
router.get('/mis-citas/:usuario_id',     citasController.obtenerMisCitas);
router.post('/',                         citasController.crearCita);
router.patch('/:id/cancelar',            citasController.cancelarCita);
router.patch('/:id/reprogramar',         citasController.reprogramarCita);
router.delete('/:id',                    citasController.eliminarCita);

module.exports = router;