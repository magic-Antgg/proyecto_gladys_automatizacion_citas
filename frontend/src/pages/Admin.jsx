import { useState, useEffect } from 'react';
import AdminNavbar from '../components/admin/AdminNavbar';
import DashboardCards from '../components/admin/DashboardCards';
import TablaCitas from '../components/admin/TablaCitas';
import TablaPacientes from '../components/admin/TablaPacientes';
import AgendaVisual from '../components/admin/AgendaVisual';
import ServiciosAdmin from '../components/admin/ServiciosAdmin';
import '../styles/admin.css';

const USUARIO_ADMIN  = 'admin@gmail.com';
const PASSWORD_ADMIN = '123456';

function Admin() {

  const [vista, setVista]             = useState('dashboard');
  const [autenticado, setAutenticado] = useState(false);
  const [usuarioAdmin, setUsuarioAdmin] = useState(null);

  const [inputUsuario, setInputUsuario]   = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError]                 = useState('');
  const [mensajeSesion, setMensajeSesion] = useState('');

  /*
  |--------------------------------------------------
  | Al cargar — detectar sesión activa de admin
  | y rellenar campos automáticamente
  |--------------------------------------------------
  */
  useEffect(() => {
    const u = localStorage.getItem('usuario');
    if (u) {
      const parsed = JSON.parse(u);
      if (parsed.rol === 'admin') {
        setUsuarioAdmin(parsed);
        // Rellenar campos automáticamente
        setInputUsuario(USUARIO_ADMIN);
        setInputPassword(PASSWORD_ADMIN);
        setMensajeSesion(`✅ Sesión activa — Bienvenido, ${parsed.nombre}`);
      }
    }
  }, []);

  /*
  |--------------------------------------------------
  | Login
  |--------------------------------------------------
  */
  const handleLogin = () => {
    if (
      inputUsuario === USUARIO_ADMIN &&
      inputPassword === PASSWORD_ADMIN
    ) {
      setAutenticado(true);
      setError('');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  /*
  |--------------------------------------------------
  | Cerrar sesión
  |--------------------------------------------------
  */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setAutenticado(false);
    setUsuarioAdmin(null);
    setInputUsuario('');
    setInputPassword('');
    setMensajeSesion('');
    setVista('dashboard');
  };

  /*
  |--------------------------------------------------
  | PANTALLA LOGIN
  |--------------------------------------------------
  */
  if (!autenticado) {
    return (
      <div className="admin-login">
        <div className="login-box">

          <h2>🦷 DentalSystem</h2>
          <p>Panel Administrador</p>

          {/* Mensaje de sesión activa si viene del login */}
          {mensajeSesion && (
            <div style={{
              background: '#d8f0ea',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#102A43',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '4px'
            }}>
              {mensajeSesion}
            </div>
          )}

          <input
            type="text"
            placeholder="Usuario"
            value={inputUsuario}
            onChange={(e) => setInputUsuario(e.target.value)}
            className="login-input"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            className="login-input"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />

          {error && <p className="login-error">{error}</p>}

          <button className="login-btn" onClick={handleLogin}>
            Entrar
          </button>

          {/* Botón cerrar sesión solo si hay sesión activa */}
          {usuarioAdmin && (
            <button
              className="login-btn"
              style={{ background: '#e74c3c', marginTop: '8px' }}
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          )}

        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------
  | PANEL ADMIN
  |--------------------------------------------------
  */
  return (
    <div className="admin-container">
      <AdminNavbar vista={vista} setVista={setVista} onLogout={handleLogout} />
      <div className="admin-content">
        {vista === 'dashboard'  && <DashboardCards />}
        {vista === 'citas'      && <TablaCitas />}
        {vista === 'pacientes'  && <TablaPacientes />}
        {vista === 'servicios'  && <ServiciosAdmin />}
        {vista === 'agenda'     && <AgendaVisual />}
      </div>
    </div>
  );
}

export default Admin;