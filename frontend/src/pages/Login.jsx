import {
  useNavigate
} from 'react-router-dom';

import {
  useState
} from 'react';

import '../styles/styles.css';

const Login = () => {

  const navigate = useNavigate();

  const [nombre, setNombre] =
    useState('');

  const [correo, setCorreo] =
    useState('');

  const [telefono, setTelefono] =
    useState('');

  const login = () => {

    if (
      !nombre ||
      !correo ||
      !telefono
    ) {

      alert(
        'Completa todos los campos'
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTANTE:
    | usar paciente fijo existente
    |--------------------------------------------------------------------------
    */

    const usuario = {

      id: 1,

      nombre,

      correo,

      telefono

    };

    localStorage.setItem(

      'usuario',

      JSON.stringify(usuario)

    );

    navigate('/servicios');

  };

  return (

    <div className="container">

      <div className="top"></div>

      <div className="content">

        <h2>Login</h2>

        <p className="subtitle">
          Inicia sesión
        </p>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) =>
            setNombre(
              e.target.value
            )
          }
        />

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) =>
            setCorreo(
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) =>
            setTelefono(
              e.target.value
            )
          }
        />

        <button onClick={login}>
          Continuar
        </button>

      </div>

    </div>

  );

};

export default Login;