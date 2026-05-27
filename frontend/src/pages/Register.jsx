import { useNavigate } from 'react-router-dom';

import { useState } from 'react';

import api from '../services/api';

import '../styles/styles.css';

const Register = () => {

  const navigate = useNavigate();

  const [nombre, setNombre] =
    useState('');

  const [correo, setCorreo] =
    useState('');

    const [telefono, setTelefono] =
  useState('');

  const [password, setPassword] =
    useState('');

  const register = async () => {

    try {

      if (
        !nombre ||
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
          '/auth/register',
        {
        nombre,
        correo,
        telefono,
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

      alert(
        'Cuenta creada correctamente'
      );

      navigate('/mis-citas');

    } catch (error) {

      console.error(error);

      alert(
        'Error al registrar'
      );
    }
  };

  return (

    <div className="container">

      <div className="top"></div>

      <div className="content">

        <h2>
          Crear Cuenta
        </h2>

        <p className="subtitle">
          Registra tu cuenta
        </p>

        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) =>
            setCorreo(e.target.value)
          }
        />

            <input
            type="tel"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) =>
                setTelefono(e.target.value)
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
            register()
          }
        />

        <button
          onClick={register}
        >
          Registrarse
        </button>

        <button
          onClick={() =>
            navigate('/')
          }
        >
          Ya tengo cuenta
        </button>

      </div>

    </div>
  );
};

export default Register;