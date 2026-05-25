const pacientesService = require('../services/pacientes.service');

const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await pacientesService.obtenerPacientes();
    res.status(200).json({ ok: true, data: pacientes });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

const buscarPacientePorCorreo = async (req, res) => {
  try {
    const { correo } = req.query;
    if (!correo) return res.status(400).json({ ok: false, message: 'Correo requerido' });
    const paciente = await pacientesService.buscarPacientePorCorreo(correo);
    if (!paciente) return res.status(404).json({ ok: false, message: 'Paciente no encontrado' });
    res.status(200).json({ ok: true, data: paciente });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

const crearPaciente = async (req, res) => {
  try {
    const { nombre, telefono, correo, fecha_nacimiento } = req.body;
    const nuevo = await pacientesService.crearPaciente({ nombre, telefono, correo, fecha_nacimiento, activo: true });
    res.status(201).json({ ok: true, data: nuevo });
  } catch (error) {
    const esDuplicado = error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique constraint');
    if (esDuplicado) return res.status(409).json({ ok: false, message: 'Ya existe un paciente con ese teléfono o correo.' });
    res.status(500).json({ ok: false, message: error.message });
  }
};

const actualizarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await pacientesService.actualizarPaciente(id, req.body);
    res.status(200).json({ ok: true, data: paciente });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Soft delete — no borra físicamente para respetar FK con citas
|--------------------------------------------------------------------------
*/
const eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    await pacientesService.desactivarPaciente(id);
    res.status(200).json({ ok: true, message: 'Paciente desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

module.exports = { obtenerPacientes, buscarPacientePorCorreo, crearPaciente, actualizarPaciente, eliminarPaciente };