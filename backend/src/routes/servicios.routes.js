const express = require('express');

const router = express.Router();

const {
  obtenerServicios
} = require(
  '../controllers/servicios.controller'
);

/*
|--------------------------------------------------------------------------
| GET servicios
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  obtenerServicios
);

module.exports = router;