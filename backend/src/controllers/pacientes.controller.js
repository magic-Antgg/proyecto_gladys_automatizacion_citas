const pacientesService = require('../services/pacientes.service');
const { pacienteSchema } = require('../validations/pacientes.validation');

/*
|--------------------------------------------------------------------------
| Obtener pacientes
|--------------------------------------------------------------------------
*/

const obtenerPacientes = async (req, res) => {

  try {

    const pacientes = await pacientesService.obtenerPacientes();

    res.status(200).json({
      ok: true,
      data: pacientes
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
| Obtener paciente por ID
|--------------------------------------------------------------------------
*/

const obtenerPacientePorId = async (req, res) => {

  try {

    const { id } = req.params;

    const paciente = await pacientesService.obtenerPacientePorId(id);

    res.status(200).json({
      ok: true,
      data: paciente
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
| Crear paciente
| - Si el teléfono o correo ya existe (duplicado), devuelve 409
|--------------------------------------------------------------------------
*/

const crearPaciente = async (req, res) => {

  try {

    const datosValidados = pacienteSchema.parse(req.body);

    const nuevoPaciente = await pacientesService.crearPaciente(datosValidados);

    res.status(201).json({
      ok: true,
      data: nuevoPaciente
    });

  } catch (error) {

    // Error de duplicado en Supabase/Postgres
    const esDuplicado =
      error.code === '23505' ||
      error.message?.includes('duplicate key') ||
      error.message?.includes('unique constraint');

    if (esDuplicado) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un paciente con ese teléfono o correo.'
      });
    }

    res.status(500).json({
      ok: false,
      message: error.message
    });

  }

};

/*
|--------------------------------------------------------------------------
| Actualizar paciente
|--------------------------------------------------------------------------
*/

const actualizarPaciente = async (req, res) => {

  try {

    const { id } = req.params;

    const pacienteActualizado =
      await pacientesService.actualizarPaciente(id, req.body);

    res.status(200).json({
      ok: true,
      data: pacienteActualizado
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
| Eliminar paciente
|--------------------------------------------------------------------------
*/

const eliminarPaciente = async (req, res) => {

  try {

    const { id } = req.params;

    await pacientesService.eliminarPaciente(id);

    res.status(200).json({
      ok: true,
      message: 'Paciente eliminado correctamente'
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
| Buscar paciente por correo
| - Si no existe → 404 (para que el frontend lo detecte correctamente)
| - Si existe   → 200 con los datos
|--------------------------------------------------------------------------
*/

const buscarPacientePorCorreo = async (req, res) => {

  try {

    const { correo } = req.query;

    if (!correo) {
      return res.status(400).json({
        ok: false,
        message: 'El parámetro correo es requerido'
      });
    }

    const paciente = await pacientesService.buscarPacientePorCorreo(correo);

    // Paciente no encontrado → 404 para que el frontend entre al bloque catch
    if (!paciente) {
      return res.status(404).json({
        ok: false,
        message: 'Paciente no encontrado'
      });
    }

    res.status(200).json({
      ok: true,
      data: paciente
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      message: error.message
    });

  }

};

module.exports = {
  obtenerPacientes,
  obtenerPacientePorId,
  buscarPacientePorCorreo,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente
};