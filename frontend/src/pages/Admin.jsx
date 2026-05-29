import { useState, useEffect } from 'react';
import AdminNavbar from '../components/admin/AdminNavbar';
import DashboardCards from '../components/admin/DashboardCards';
import TablaCitas from '../components/admin/TablaCitas';
import TablaPacientes from '../components/admin/TablaPacientes';
import AgendaVisual from '../components/admin/AgendaVisual';
import ServiciosAdmin from '../components/admin/ServiciosAdmin';
import GestionUsuarios from '../components/admin/GestionUsuarios';
import '../styles/admin.css';

const USUARIO_ADMIN  = 'Carolina';
const PASSWORD_ADMIN = 'Dental2026$';

function Admin() {

  const [vista, setVista]               = useState('dashboard');
  const [autenticado, setAutenticado]   = useState(false);
  const [usuarioAdmin, setUsuarioAdmin] = useState(null);
  const [inputUsuario, setInputUsuario]   = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError]                 = useState('');
  const [mensajeSesion, setMensajeSesion] = useState('');

  useEffect(() => {
    const u = localStorage.getItem('usuario');
    if (u) {
      const parsed = JSON.parse(u);
      if (['admin', 'dentista', 'recepcionista'].includes(parsed.rol)) {
        setUsuarioAdmin(parsed);
        setInputUsuario(USUARIO_ADMIN);
        setInputPassword(PASSWORD_ADMIN);
        setMensajeSesion(`✅ Sesión activa — Bienvenido, ${parsed.nombre}`);
      }
    }
  }, []);

  const handleLogin = () => {
    if (inputUsuario === USUARIO_ADMIN && inputPassword === PASSWORD_ADMIN) {
      setAutenticado(true);
      setError('');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

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

  if (!autenticado) {
    return (
      <div className="admin-login">
        <div className="login-box">
          <h2>🦷 DentalSystem</h2>
          <p>Panel Administrador</p>

          {mensajeSesion && (
            <div style={{
              background: '#d8f0ea', borderRadius: '10px',
              padding: '10px 14px', color: '#102A43',
              fontSize: '13px', fontWeight: '500', marginBottom: '4px'
            }}>
              {mensajeSesion}
            </div>
          )}

          <input type="text" placeholder="Usuario"
            value={inputUsuario}
            onChange={(e) => setInputUsuario(e.target.value)}
            className="login-input" />

          <input type="password" placeholder="Contraseña"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            className="login-input"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />

          {error && <p className="login-error">{error}</p>}

          <button className="login-btn" onClick={handleLogin}>Entrar</button>

          {usuarioAdmin && (
            <button className="login-btn"
              style={{ background: '#e74c3c', marginTop: '8px' }}
              onClick={handleLogout}>
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    );
  }

  const rol = usuarioAdmin?.rol || 'admin';

  return (
    <div className="admin-container">
      <AdminNavbar vista={vista} setVista={setVista} onLogout={handleLogout} rol={rol} />
      <div className="admin-content">
        {vista === 'dashboard' && <DashboardCards />}
        {vista === 'citas'     && (rol === 'admin' || rol === 'recepcionista') && <TablaCitas />}
        {vista === 'pacientes' && (rol === 'admin' || rol === 'recepcionista') && <TablaPacientes />}
        {vista === 'servicios' && rol === 'admin' && <ServiciosAdmin />}
        {vista === 'agenda'    && <AgendaVisual />}
        {vista === 'usuarios'  && rol === 'admin' && <GestionUsuarios />}
      </div>
    </div>
  );
}

export default Admin;