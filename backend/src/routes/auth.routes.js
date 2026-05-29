const express = require('express');
const router  = express.Router();
const {
  login,
  register,
  crearUsuario,
  obtenerUsuarios,
  eliminarUsuario
} = require('../controllers/auth.controller');

router.post('/login',            login);
router.post('/register',         register);
router.post('/crear-usuario',    crearUsuario);
router.get('/usuarios',          obtenerUsuarios);
router.delete('/usuarios/:id',   eliminarUsuario);

module.exports = router;