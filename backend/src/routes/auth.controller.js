const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const supabase =
require('../config/supabase');

const register = async (req, res) => {

  try {

    const {
      nombre,
      correo,
      password
    } = req.body;

    if (
      !nombre ||
      !correo ||
      !password
    ) {

      return res.status(400).json({
        ok: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    const passwordHash =
      await bcrypt.hash(password, 10);

    const { data, error } =
      await supabase
        .from('usuarios')
        .insert([
          {
            nombre,
            correo,
            password: passwordHash
          }
        ])
        .select()
        .single();

    if (error) throw error;

    const token = jwt.sign(
      {
        id: data.id,
        correo: data.correo
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.status(201).json({
      ok: true,
      token,
      usuario: data
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {

  try {

    const {
      correo,
      password
    } = req.body;

    const { data, error } =
      await supabase
        .from('usuarios')
        .select('*')
        .eq('correo', correo)
        .single();

    if (error || !data) {

      return res.status(401).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    const passwordCorrecta =
      await bcrypt.compare(
        password,
        data.password
      );

    if (!passwordCorrecta) {

      return res.status(401).json({
        ok: false,
        message: 'Contraseña incorrecta'
      });
    }

    const token = jwt.sign(
      {
        id: data.id,
        correo: data.correo
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.json({
      ok: true,
      token,
      usuario: data
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login
};