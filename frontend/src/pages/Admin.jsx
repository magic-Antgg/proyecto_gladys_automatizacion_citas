import { useState, useEffect } from 'react';
import AdminNavbar from '../components/admin/AdminNavbar';
import DashboardCards from '../components/admin/DashboardCards';
import TablaCitas from '../components/admin/TablaCitas';
import TablaPacientes from '../components/admin/TablaPacientes';
import AgendaVisual from '../components/admin/AgendaVisual';
import ServiciosAdmin from '../components/admin/ServiciosAdmin';
import GestionUsuarios from '../components/admin/GestionUsuarios';
import '../styles/admin.css';

function Admin() {

  const [vista, setVista] = useState('dashboard');
  const [usuarioAdmin, setUsuarioAdmin] = useState(null);

  useEffect(() => {

    const u =
      localStorage.getItem(
        'usuario'
      );

    if (!u) {

      window.location.href = '/';

      return;

    }

    const parsed =
      JSON.parse(u);

    if (
      ![
        'admin',
        'dentista',
        'recepcionista'
      ].includes(parsed.rol)
    ) {

      window.location.href = '/';

      return;

    }

    setUsuarioAdmin(parsed);

  }, []);

  const handleLogout = () => {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'usuario'
    );

    window.location.href = '/';

  };

  if (!usuarioAdmin) {

    return (
      <div className="admin-container">
        <div className="admin-content">
          <h2>Cargando...</h2>
        </div>
      </div>
    );

  }

  const rol =
    usuarioAdmin?.rol || 'admin';

  return (

    <div className="admin-container">

      <AdminNavbar
        vista={vista}
        setVista={setVista}
        onLogout={handleLogout}
        rol={rol}
      />

      <div className="admin-content">

        <div
          style={{
            background: '#173f67',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '14px 18px',
            borderRadius: '14px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >

          <div
            style={{
              width: '55px',
              height: '55px',
              borderRadius: '50%',
              background: '#36a2c9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '22px',
              fontWeight: 'bold'
            }}
          >
            {usuarioAdmin.nombre?.charAt(0).toUpperCase()}
          </div>

          <div>

            <h2
              style={{
                margin: 0,
                color: '#ffffff',
                fontSize: '32px'
              }}
            >
              Bienvenido, {usuarioAdmin.nombre}
            </h2>

            <p
              style={{
                margin: '4px 0',
                color: '#d6e4f0'
              }}
            >
              📧 {usuarioAdmin.correo}
            </p>

            <p
              style={{
                margin: '4px 0',
                color: '#d6e4f0'
              }}
            >
              🛡️ Rol:
              <strong
                style={{
                  marginLeft: '8px',
                  color:
                    rol === 'admin'
                      ? '#ff6b6b'
                      : rol === 'dentista'
                      ? '#4fc3f7'
                      : '#68d391'
                }}
              >
                {rol.toUpperCase()}
              </strong>
            </p>

            <p
              style={{
                margin: '4px 0',
                color: '#9fb3c8',
                fontSize: '13px'
              }}
            >
              📅 {new Date().toLocaleDateString(
                'es-MX',
                {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }
              )}
            </p>

          </div>

        </div>

        {vista === 'dashboard' &&
          <DashboardCards />
        }

        {vista === 'citas' &&
          (
            rol === 'admin' ||
            rol === 'dentista' ||
            rol === 'recepcionista'
          ) &&
          <TablaCitas />
        }

        {vista === 'pacientes' &&
          (
            rol === 'admin' ||
            rol === 'dentista' ||
            rol === 'recepcionista'
          ) &&
          <TablaPacientes />
        }

        {vista === 'servicios' &&
          (
            rol === 'admin' ||
            rol === 'dentista'
          ) &&
          <ServiciosAdmin />
        }

        {vista === 'agenda' &&
          <AgendaVisual />
        }

        {vista === 'usuarios' &&
          rol === 'admin' &&
          <GestionUsuarios />
        }

      </div>

    </div>

  );

}

export default Admin;