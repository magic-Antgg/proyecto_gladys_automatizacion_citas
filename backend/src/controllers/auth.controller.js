const jwt =
  require('jsonwebtoken');

const authService =
  require('../services/auth.service');

const login = async (
  req,
  res
) => {

  try {

    const {
      correo,
      password
    } = req.body;

    const usuario =
      await authService
        .loginUsuario(correo);

    if (!usuario) {

      return res.status(404).json({

        ok: false,

        message:
          'Usuario no encontrado'

      });

    }

    if (
      password !== usuario.password
    ) {

      return res.status(401).json({

        ok: false,

        message:
          'Contraseña incorrecta'

      });

    }

    const token = jwt.sign(

      {

        id: usuario.id,

        correo: usuario.correo,

        rol: usuario.rol

      },

      process.env.JWT_SECRET,

      {

        expiresIn: '7d'

      }

    );

    res.json({

      ok: true,

      token,

      usuario

    });

  } catch (error) {

    res.status(500).json({

      ok: false,

      message: error.message

    });

  }

};

module.exports = {
  login
};