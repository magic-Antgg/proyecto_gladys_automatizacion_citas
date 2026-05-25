const supabase = require('../config/supabase');

const obtenerPacientes = async () => {
  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .eq('activo', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

const obtenerPacientePorId = async (id) => {
  const { data, error } = await supabase
    .from('pacientes').select('*').eq('id', id).limit(1);
  if (error) throw error;
  return data?.[0] || null;
};

const buscarPacientePorCorreo = async (correo) => {
  if (!correo) return null;
  const { data, error } = await supabase
    .from('pacientes').select('*').eq('correo', correo).eq('activo', true).limit(1);
  if (error) throw error;
  return data?.[0] || null;
};

const crearPaciente = async (datos) => {
  const { data, error } = await supabase
    .from('pacientes').insert([datos]).select('*').single();
  if (error) throw error;
  return data;
};

const actualizarPaciente = async (id, datos) => {
  const { data, error } = await supabase
    .from('pacientes').update(datos).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
};

/*
|--------------------------------------------------------------------------
| Soft delete — marca activo=false, no borra físicamente
| Evita error de FK con tabla citas
|--------------------------------------------------------------------------
*/
const desactivarPaciente = async (id) => {
  const { error } = await supabase
    .from('pacientes').update({ activo: false }).eq('id', id);
  if (error) throw error;
  return true;
};

module.exports = {
  obtenerPacientes,
  obtenerPacientePorId,
  buscarPacientePorCorreo,
  crearPaciente,
  actualizarPaciente,
  desactivarPaciente
};