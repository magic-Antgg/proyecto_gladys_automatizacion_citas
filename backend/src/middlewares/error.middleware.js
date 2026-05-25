/*
|--------------------------------------------------------------------------
| Middleware global de errores
| Se registra al final de app.js con: app.use(errorHandler)
|--------------------------------------------------------------------------
*/

const errorHandler = (err, req, res, next) => {

  console.error('Error:', err.message);

  // Error de validación Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      ok: false,
      message: err.errors[0]?.message || 'Datos inválidos'
    });
  }

  // Error de duplicado Postgres
  if (err.code === '23505') {
    return res.status(409).json({
      ok: false,
      message: 'Ya existe un registro con esos datos'
    });
  }

  // Error genérico
  res.status(500).json({
    ok: false,
    message: 'Error interno del servidor'
  });
};

module.exports = errorHandler;