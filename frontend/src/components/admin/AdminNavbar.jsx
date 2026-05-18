function AdminNavbar({ vista, setVista }) {
  return (
    <div className="sidebar">

      <h2 className="sidebar-title">🦷 DentalSystem</h2>

      <nav>
        <button
          className={vista === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setVista('dashboard')}
        >
          📊 Dashboard
        </button>

        <button
          className={vista === 'citas' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setVista('citas')}
        >
          📅 Citas
        </button>

        <button
          className={vista === 'pacientes' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setVista('pacientes')}
        >
          👥 Pacientes
        </button>

        <button
          className={vista === 'agenda' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setVista('agenda')}
        >
          🗓️ Agenda
        </button>
      </nav>

    </div>
  );
}

export default AdminNavbar;