const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const pacientesRoutes  = require('./routes/pacientes.routes');
const citasRoutes      = require('./routes/citas.routes');
const serviciosRoutes  = require('./routes/servicios.routes');
const dashboardRoutes  = require('./routes/dashboard.routes');
const authRoutes       = require('./routes/auth.routes');
const errorHandler     = require('./middlewares/error.middleware');

const app = express();

/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

/*
|--------------------------------------------------------------------------
| Rutas API
|--------------------------------------------------------------------------
*/
app.use('/api/auth',      authRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/citas',     citasRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/dashboard', dashboardRoutes);

/*
|--------------------------------------------------------------------------
| Ruta principal
|--------------------------------------------------------------------------
*/
app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'DentalSystem API funcionando'
  });
});

/*
|--------------------------------------------------------------------------
| Middleware global de errores — debe ir AL FINAL
|--------------------------------------------------------------------------
*/
app.use(errorHandler);

module.exports = app;