function AdminNavbar({ vista, setVista, onLogout }) {
  const opciones = [
    { id: 'dashboard', label: 'Dashboard',  icono: '📊' },
    { id: 'citas',     label: 'Citas',      icono: '📅' },
    { id: 'pacientes', label: 'Pacientes',  icono: '👥' },
    { id: 'servicios', label: 'Servicios',  icono: '🦷' },
    { id: 'agenda',    label: 'Agenda',     icono: '🗓️' },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">🦷 DentalSystem</h2>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {opciones.map((op) => (
          <button key={op.id}
            className={vista === op.id ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setVista(op.id)}>
            {op.icono} {op.label}
          </button>
        ))}
      </nav>
      <button className="nav-btn" onClick={onLogout}
        style={{ marginTop: 'auto', color: '#fc8181', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
        🚪 Cerrar sesión
      </button>
    </div>
  );
}
export default AdminNavbar;