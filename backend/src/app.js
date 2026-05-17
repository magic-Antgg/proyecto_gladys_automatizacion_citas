const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const pacientesRoutes = require('./routes/pacientes.routes');
const citasRoutes = require('./routes/citas.routes');

const supabase = require('./config/supabase');

const app = express();



const serviciosRoutes = require(
  './routes/servicios.routes'
);

/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use(express.json());
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/citas', citasRoutes);
app.use(
  '/api/servicios',
  serviciosRoutes
);

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
| Ruta prueba Supabase
|--------------------------------------------------------------------------
*/

app.get('/test-db', async (req, res) => {

  try {

    const { data, error } = await supabase
      .from('servicios')
      .select('*');

    if (error) {
      throw error;
    }

    res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      message: error.message
    });

  }

});


module.exports = app;