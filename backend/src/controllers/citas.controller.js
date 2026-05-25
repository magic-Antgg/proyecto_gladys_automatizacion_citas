const citasService = require('../services/citas.service');
const { citaSchema } = require('../validations/citas.validation');

/*
|--------------------------------------------------------------------------
| Obtener agenda
|--------------------------------------------------------------------------
*/
const obtenerAgenda = async (req, res) => {
  try {
    const agenda = await citasService.obtenerAgenda();
    res.status(200).json({ ok: true, data: agenda });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Crear cita
|--------------------------------------------------------------------------
*/
const crearCita = async (req, res) => {
  try {
    // Validar campos mínimos antes de parsear con Zod
    const { paciente_id, fecha, hora_inicio, servicios } = req.body;

    if (!paciente_id || !fecha || !hora_inicio) {
      return res.status(400).json({
        ok: false,
        message: 'paciente_id, fecha y hora_inicio son obligatorios'
      });
    }

    if (!servicios || servicios.length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'Selecciona al menos un servicio'
      });
    }

    // Validar que la fecha no sea en el pasado
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaCita = new Date(fecha);
    if (fechaCita < hoy) {
      return res.status(400).json({
        ok: false,
        message: 'No puedes agendar citas en fechas pasadas'
      });
    }

    const datosValidados = citaSchema.parse(req.body);
    const nuevaCita = await citasService.crearCita(datosValidados);

    res.status(201).json({ ok: true, data: nuevaCita });

  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
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
    const citaCancelada = await citasService.cancelarCita(id);
    res.status(200).json({
      ok: true,
      message: 'Cita cancelada correctamente',
      data: citaCancelada
    });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
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
    const { fecha, hora_inicio } = req.body;

    if (!fecha || !hora_inicio) {
      return res.status(400).json({
        ok: false,
        message: 'Fecha y hora son obligatorias'
      });
    }

    // Validar que la nueva fecha no sea en el pasado
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaCita = new Date(fecha);
    if (fechaCita < hoy) {
      return res.status(400).json({
        ok: false,
        message: 'No puedes reprogramar a una fecha pasada'
      });
    }

    const cita = await citasService.reprogramarCita(id, fecha, hora_inicio);
    res.status(200).json({
      ok: true,
      message: 'Cita reprogramada correctamente',
      data: cita
    });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

module.exports = { crearCita, obtenerAgenda, cancelarCita, reprogramarCita };