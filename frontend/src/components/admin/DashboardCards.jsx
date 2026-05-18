import { useEffect, useState } from 'react';
import axios from 'axios';

function DashboardCards() {
  const [stats, setStats] = useState({
    totalCitas: 0,
    totalPacientes: 0,
    canceladas: 0
  });

  useEffect(() => {
    axios.get('http://localhost:3000/api/dashboard')
      .then(res => setStats(res.data.data))
      .catch(err => console.error('Error cargando estadísticas:', err));
  }, []);

  return (
    <div>
      <h2 className="section-title">📊 Dashboard</h2>

      <div className="cards">

        <div className="card">
          <h3>Total Citas</h3>
          <p>{stats.totalCitas}</p>
        </div>

        <div className="card">
          <h3>Pacientes Registrados</h3>
          <p>{stats.totalPacientes}</p>
        </div>

        <div className="card">
          <h3>Citas Canceladas</h3>
          <p>{stats.canceladas}</p>
        </div>

      </div>
    </div>
  );
}

export default DashboardCards;