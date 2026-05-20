const supabase = require('../config/supabase');

/*
|--------------------------------------------------
| Obtener pacientes
|--------------------------------------------------
*/

const obtenerPacientes = async (req, res) => {

  try {

    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

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
};

/*
|--------------------------------------------------
| Crear paciente
|--------------------------------------------------
*/

const crearPaciente = async (req, res) => {

  try {

    const {
      nombre,
      telefono,
      correo,
      fecha_nacimiento
    } = req.body;

    const { data, error } = await supabase
      .from('pacientes')
      .insert([
        {
          nombre,
          telefono,
          correo,
          fecha_nacimiento,
          activo: true
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      ok: true,
      data
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

/*
|--------------------------------------------------
| Actualizar paciente
|--------------------------------------------------
*/

const actualizarPaciente = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      nombre,
      telefono,
      correo,
      fecha_nacimiento
    } = req.body;

    const { data, error } = await supabase
      .from('pacientes')
      .update({
        nombre,
        telefono,
        correo,
        fecha_nacimiento
      })
      .eq('id', id)
      .select();

    if (error) throw error;

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
};

/*
|--------------------------------------------------
| Eliminar paciente
|--------------------------------------------------
*/

const eliminarPaciente = async (req, res) => {

  try {

    const { id } = req.params;

    const { error } = await supabase
      .from('pacientes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      ok: true,
      message: 'Paciente eliminado'
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
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente
};