import { useNavigate } from 'react-router-dom';

import { useState } from 'react';

import api from '../services/api';

import '../styles/styles.css';

const Login = () => {

  const navigate = useNavigate();

  const [correo, setCorreo] =
    useState('');

  const [password, setPassword] =
    useState('');

  const login = async () => {

    try {

      if (
        !correo ||
        !password
      ) {

        alert(
          'Completa todos los campos'
        );

        return;
      }

      const res =
        await api.post(
          '/auth/login',
          {
            correo,
            password
          }
        );

      localStorage.setItem(

        'token',

        res.data.token

      );

      localStorage.setItem(

        'usuario',

        JSON.stringify(
          res.data.usuario
        )

      );

const rol =
  res.data.usuario?.rol;

if (

  rol === 'admin' ||

  rol === 'recepcionista' ||

  rol === 'dentista'

) {

  navigate('/admin');

} else {

  navigate('/mis-citas');

}

    } catch (error) {

      console.error(error);

      alert(
        'Credenciales incorrectas'
      );
    }
  };

  return (

    <div className="container">

      <div className="top"></div>

      <div className="content">

        <h2>
          Login
        </h2>

        <p className="subtitle">
          Inicia sesión
        </p>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) =>
            setCorreo(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === 'Enter' &&
            login()
          }
        />

        <button
          onClick={login}
        >
          Iniciar Sesión
        </button>

        <button
          onClick={() =>
            navigate('/register')
          }
        >
          Crear Cuenta
        </button>

      </div>

    </div>
  );
};

export default Login;