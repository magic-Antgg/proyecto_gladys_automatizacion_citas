const supabase =
  require('../config/supabase');

const loginUsuario =
  async (correo) => {

    const {
      data,
      error
    } = await supabase

      .from('usuarios')

      .select('*')

      .eq('correo', correo)

      .single();

    if (error) {
      throw error;
    }

    return data;
};

module.exports = {
  loginUsuario
};