const jwt =
  require('jsonwebtoken');

const verificarToken =
  (req, res, next) => {

    try {

      /*
      |-----------------------------------
      | Obtener token
      |-----------------------------------
      */

      const authHeader =
        req.headers.authorization;

      if (!authHeader) {

        return res.status(401).json({

          ok: false,

          message:
            'Token requerido'

        });

      }

      /*
      |-----------------------------------
      | Bearer TOKEN
      |-----------------------------------
      */

      const token =
        authHeader.split(' ')[1];

      /*
      |-----------------------------------
      | Verificar JWT
      |-----------------------------------
      */

      const decoded =
        jwt.verify(

          token,

          process.env.JWT_SECRET

        );

      /*
      |-----------------------------------
      | Guardar usuario
      |-----------------------------------
      */

      req.usuario = decoded;

      next();

    } catch (error) {

      return res.status(401).json({

        ok: false,

        message:
          'Token inválido'

      });

    }

};

const verificarAdmin =
  (req, res, next) => {

    try {

      if (
        req.usuario.rol !== 'admin'
      ) {

        return res.status(403).json({

          ok: false,

          message:
            'Acceso denegado'

        });

      }

      next();

    } catch (error) {

      return res.status(500).json({

        ok: false,

        message:
          error.message

      });

    }

};

module.exports = {

  verificarToken,

  verificarAdmin

};