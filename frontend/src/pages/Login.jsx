import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/styles.css';

const Login = () => {

  const navigate = useNavigate();
  const [nombre, setNombre]     = useState('');
  const [correo, setCorreo]     = useState('');
  const [telefono, setTelefono] = useState('');

  const login = () => {

    if (!nombre || !correo || !telefono) {
      alert('Completa todos los campos');
      return;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      alert('Ingresa un correo válido');
      return;
    }

    // Validar teléfono — mínimo 10 dígitos
    const soloNumeros = telefono.replace(/\D/g, '');
    if (soloNumeros.length < 10) {
      alert('Ingresa un teléfono válido (mínimo 10 dígitos)');
      return;
    }

    localStorage.setItem('usuario', JSON.stringify({
      id: 1, nombre, correo, telefono: soloNumeros
    }));

    navigate('/servicios');
  };

  return (
    <div className="container">
      <div className="top"></div>
      <div className="content">
        <h2>Login</h2>
        <p className="subtitle">Inicia sesión</p>

        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Teléfono (10 dígitos)"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()}
        />

        <button onClick={login}>Continuar</button>
      </div>
    </div>
  );
};

export default Login;