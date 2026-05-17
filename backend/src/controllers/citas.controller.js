const citasService =
require('../services/citas.service');

const {
  citaSchema
} = require('../validations/citas.validation');

/*
|--------------------------------------------------------------------------
| Crear cita
|--------------------------------------------------------------------------
*/

const crearCita = async (req, res) => {

  try {

    /*
    |--------------------------------------------------------------------------
    | Validar datos
    |--------------------------------------------------------------------------
    */

    const datosValidados =
      citaSchema.parse(req.body);

    /*
    |--------------------------------------------------------------------------
    | Crear cita
    |--------------------------------------------------------------------------
    */

    const nuevaCita =
      await citasService.crearCita(datosValidados);

    res.status(201).json({
      ok: true,
      data: nuevaCita
    });

  } catch (error) {

    res.status(400).json({
      ok: false,
      message: error.message
    });

  }

};

/*
|--------------------------------------------------------------------------
| Obtener agenda
|--------------------------------------------------------------------------
*/

const obtenerAgenda = async (req, res) => {

  try {

    const agenda =
      await citasService.obtenerAgenda();

    res.status(200).json({
      ok: true,
      data: agenda
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      message: error.message
    });

  }

};
/*
|--------------------------------------------------------------------------
| Cancelar cita
|--------------------------------------------------------------------------
*/

const cancelarCita = async (req, res) => {

  try {

    const { id } = req.params;

    const citaCancelada =
      await citasService.cancelarCita(id);

    res.status(200).json({
      ok: true,
      message: 'Cita cancelada correctamente',
      data: citaCancelada
    });

  } catch (error) {

    res.status(400).json({
      ok: false,
      message: error.message
    });

  }

};
/*
|--------------------------------------------------------------------------
| Reprogramar cita
|--------------------------------------------------------------------------
*/

const reprogramarCita = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      fecha,
      hora_inicio
    } = req.body;

    const cita =
      await citasService.reprogramarCita(
        id,
        fecha,
        hora_inicio
      );

    res.status(200).json({
      ok: true,
      message: 'Cita reprogramada correctamente',
      data: cita
    });

  } catch (error) {

    res.status(400).json({
      ok: false,
      message: error.message
    });

  }

};
module.exports = {
  crearCita,
  obtenerAgenda,
  cancelarCita,
  reprogramarCita
};