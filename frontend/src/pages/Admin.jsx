import { useState } from 'react';

import AdminNavbar from '../components/admin/AdminNavbar';
import DashboardCards from '../components/admin/DashboardCards';
import TablaCitas from '../components/admin/TablaCitas';
import TablaPacientes from '../components/admin/TablaPacientes';
import AgendaVisual from '../components/admin/AgendaVisual';

import '../styles/admin.css';

const USUARIO_ADMIN = 'Carolina';
const PASSWORD_ADMIN = 'Dental2026$';

function Admin() {

  const [vista, setVista] = useState('dashboard');
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {

    if (
      usuario === USUARIO_ADMIN &&
      password === PASSWORD_ADMIN
    ) {
      setAutenticado(true);
      setError('');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  if (!autenticado) {
    return (
      <div className="admin-login">
        <div className="login-box">
          <h2>🦷 DentalSystem</h2>
          <p>Panel Administrador</p>

          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="login-input"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />

          {error && <p className="login-error">{error}</p>}

          <button className="login-btn" onClick={handleLogin}>
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminNavbar vista={vista} setVista={setVista} />
      <div className="admin-content">
        {vista === 'dashboard' && <DashboardCards />}
        {vista === 'citas' && <TablaCitas />}
        {vista === 'pacientes' && <TablaPacientes />}
        {vista === 'agenda' && <AgendaVisual />}
      </div>
    </div>
  );
}

export default Admin;