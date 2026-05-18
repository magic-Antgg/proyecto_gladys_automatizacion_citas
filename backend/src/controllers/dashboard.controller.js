const supabase = require('../config/supabase');

const obtenerEstadisticas = async (req, res) => {
  try {
    const { count: totalCitas } = await supabase
      .from('citas')
      .select('*', { count: 'exact', head: true });

    const { count: totalPacientes } = await supabase
      .from('pacientes')
      .select('*', { count: 'exact', head: true });

    const { count: canceladas } = await supabase
      .from('citas')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'cancelada');

    res.status(200).json({
      ok: true,
      data: {
        totalCitas,
        totalPacientes,
        canceladas
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

module.exports = { obtenerEstadisticas };