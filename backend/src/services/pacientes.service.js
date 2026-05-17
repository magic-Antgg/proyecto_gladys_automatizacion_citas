const supabase = require('../config/supabase');

/*
|--------------------------------------------------------------------------
| Obtener todos los pacientes
|--------------------------------------------------------------------------
*/

const obtenerPacientes = async () => {

  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;

  return data;
};

/*
|--------------------------------------------------------------------------
| Obtener paciente por ID
|--------------------------------------------------------------------------
*/

const obtenerPacientePorId = async (id) => {

  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
};

/*
|--------------------------------------------------------------------------
| Crear paciente
|--------------------------------------------------------------------------
*/

const crearPaciente = async (paciente) => {

  const { data, error } = await supabase
    .from('pacientes')
    .insert([paciente])
    .select()
    .single();

  if (error) throw error;

  return data;
};

/*
|--------------------------------------------------------------------------
| Actualizar paciente
|--------------------------------------------------------------------------
*/

const actualizarPaciente = async (id, paciente) => {

  const { data, error } = await supabase
    .from('pacientes')
    .update(paciente)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

/*
|--------------------------------------------------------------------------
| Eliminar paciente
|--------------------------------------------------------------------------
*/

const eliminarPaciente = async (id) => {

  const { error } = await supabase
    .from('pacientes')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return true;
};

/*
|--------------------------------------------------------------------------
| Buscar paciente por correo
| - Usa .ilike() para búsqueda sin importar mayúsculas
| - PGRST116 = "no rows found" → no es un error real, devuelve null
|--------------------------------------------------------------------------
*/

const buscarPacientePorCorreo = async (correo) => {

  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .ilike('correo', correo)
    .single();

  // PGRST116 = paciente no existe → flujo normal, no lanzar error
  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data || null;

};

module.exports = {
  obtenerPacientes,
  obtenerPacientePorId,
  buscarPacientePorCorreo,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente
};