const supabase = require('../config/supabase');

const obtenerServicios = async (req, res) => {
  try {
    const { data, error } = await supabase.from('servicios').select('*').eq('activo', true).order('id');
    if (error) throw error;
    res.json({ ok: true, data });
  } catch (error) { res.status(500).json({ ok: false, message: error.message }); }
};

const crearServicio = async (req, res) => {
  try {
    const { nombre, precio, duracion_minutos } = req.body;
    if (!nombre || !precio) return res.status(400).json({ ok: false, message: 'Nombre y precio son obligatorios' });
    const { data, error } = await supabase.from('servicios')
      .insert([{ nombre, precio, duracion_minutos: duracion_minutos || 30, activo: true }]).select().single();
    if (error) throw error;
    res.status(201).json({ ok: true, data });
  } catch (error) { res.status(500).json({ ok: false, message: error.message }); }
};

const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('servicios').update(req.body).eq('id', id).select().single();
    if (error) throw error;
    res.json({ ok: true, data });
  } catch (error) { res.status(500).json({ ok: false, message: error.message }); }
};

// Soft delete
const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('servicios').update({ activo: false }).eq('id', id);
    if (error) throw error;
    res.json({ ok: true, message: 'Servicio eliminado' });
  } catch (error) { res.status(500).json({ ok: false, message: error.message }); }
};

module.exports = { obtenerServicios, crearServicio, actualizarServicio, eliminarServicio };