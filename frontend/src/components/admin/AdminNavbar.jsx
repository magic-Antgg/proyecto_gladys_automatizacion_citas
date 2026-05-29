function AdminNavbar({ vista, setVista, onLogout, rol }) {

  const opciones = [
    { id: 'dashboard',  label: 'Dashboard',  icono: '📊', roles: ['admin', 'dentista', 'recepcionista'] },
    { id: 'citas',      label: 'Citas',      icono: '📅', roles: ['admin', 'recepcionista'] },
    { id: 'pacientes',  label: 'Pacientes',  icono: '👥', roles: ['admin', 'recepcionista'] },
    { id: 'servicios',  label: 'Servicios',  icono: '🦷', roles: ['admin'] },
    { id: 'agenda',     label: 'Agenda',     icono: '🗓️', roles: ['admin', 'dentista', 'recepcionista'] },
    { id: 'usuarios',   label: 'Usuarios',   icono: '👤', roles: ['admin'] },
  ];

  const opcionesFiltradas = opciones.filter(
    (op) => !rol || op.roles.includes(rol)
  );

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">🦷 DentalSystem</h2>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {opcionesFiltradas.map((op) => (
          <button
            key={op.id}
            className={vista === op.id ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setVista(op.id)}
          >
            {op.icono} {op.label}
          </button>
        ))}
      </nav>

      <button
        className="nav-btn"
        onClick={onLogout}
        style={{ marginTop: 'auto', color: '#fc8181', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}
      >
        🚪 Cerrar sesión
      </button>
    </div>
  );
}

export default AdminNavbar;