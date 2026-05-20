const supabase = require('../config/supabase');

/*
|--------------------------------------------------------------------------
| Obtener pacientes
|--------------------------------------------------------------------------
*/

const obtenerPacientes = async () => {

  const {
    data,
    error
  } = await supabase
    .from('pacientes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

/*
|--------------------------------------------------------------------------
| Obtener paciente por ID
|--------------------------------------------------------------------------
*/

const obtenerPacientePorId = async (id) => {

  const {
    data,
    error
  } = await supabase
    .from('pacientes')
    .select('*')
    .eq('id', id)
    .limit(1);

  if (error) {
    throw error;
  }

  return data?.[0] || null;
};

/*
|--------------------------------------------------------------------------
| Buscar paciente por correo
|--------------------------------------------------------------------------
*/

const buscarPacientePorCorreo = async (correo) => {

  if (!correo) {
    return null;
  }

  const {
    data,
    error
  } = await supabase
    .from('pacientes')
    .select('*')
    .eq('correo', correo)
    .limit(1);

  if (error) {
    throw error;
  }

  return data?.[0] || null;
};

/*
|--------------------------------------------------------------------------
| Crear paciente
|--------------------------------------------------------------------------
*/

const crearPaciente = async (datos) => {

  const {
    data,
    error
  } = await supabase
    .from('pacientes')
    .insert([datos])
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/*
|--------------------------------------------------------------------------
| Actualizar paciente
|--------------------------------------------------------------------------
*/

const actualizarPaciente = async (id, datos) => {

  const {
    data,
    error
  } = await supabase
    .from('pacientes')
    .update(datos)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/*
|--------------------------------------------------------------------------
| Eliminar paciente
|--------------------------------------------------------------------------
*/

const eliminarPaciente = async (id) => {

  const {
    error
  } = await supabase
    .from('pacientes')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return true;
};

module.exports = {
  obtenerPacientes,
  obtenerPacientePorId,
  buscarPacientePorCorreo,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente
};