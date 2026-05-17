const supabase = require('../config/supabase');

/*
|--------------------------------------------------------------------------
| Obtener servicios
|--------------------------------------------------------------------------
*/

const obtenerServicios = async (
  req,
  res
) => {

  try {

    const { data, error } =
      await supabase
        .from('servicios')
        .select('*')
        .eq('activo', true)
        .order('id');

    if (error) {
      throw error;
    }

    res.json({
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

module.exports = {
  obtenerServicios
};