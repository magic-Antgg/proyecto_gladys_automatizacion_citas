const jwt =
  require('jsonwebtoken');

const bcrypt =
  require('bcryptjs');

const authService =
  require('../services/auth.service');

const supabase =
  require('../config/supabase');

/*
|--------------------------------------------------
| LOGIN
|--------------------------------------------------
*/

const login = async (
  req,
  res
) => {

  try {

    const {
      correo,
      password
    } = req.body;

    if (
      !correo ||
      !password
    ) {

      return res.status(400).json({

        ok: false,

        message:
          'Correo y contraseña son obligatorios'

      });

    }

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

    const passwordCorrecta =
      await bcrypt.compare(
        password,
        usuario.password
      );

    if (!passwordCorrecta) {

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

    console.log(error);

    res.status(500).json({

      ok: false,

      message:
        error.message

    });

  }

};

/*
|--------------------------------------------------
| REGISTER
|--------------------------------------------------
*/

const register = async (
  req,
  res
) => {

  try {

    const {
      nombre,
      correo,
      telefono,
      password
    } = req.body;

    if (
      !nombre ||
      !correo ||
      !telefono ||
      !password
    ) {

      return res.status(400).json({

        ok: false,

        message:
          'Todos los campos son obligatorios'

      });

    }

    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );

    const { data, error } =
      await supabase
        .from('usuarios')
        .insert([
          {

            nombre,

            correo,

            telefono,

            password:
              passwordHash,

            rol:
              'paciente'

          }
        ])
        .select()
        .single();

    if (error) {

      return res.status(400).json({

        ok: false,

        message:
          error.message

      });

    }

    const token = jwt.sign(

      {

        id: data.id,

        correo: data.correo,

        rol: data.rol

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

    console.log(error);

    res.status(500).json({

      ok: false,

      message:
        error.message

    });

  }

};




module.exports = {

  login,

  register

};