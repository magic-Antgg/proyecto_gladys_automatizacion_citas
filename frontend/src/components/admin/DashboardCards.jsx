import { useEffect, useState } from 'react';
import api from '../../services/api';

function DashboardCards() {

  const [stats, setStats]       = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => { cargarEstadisticas(); }, []);

  const cargarEstadisticas = async () => {
    try {
      setCargando(true);
      setError(null);
      const res = await api.get('/dashboard');
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las estadísticas.');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <p style={{ color: '#a0aec0', padding: '20px' }}>Cargando estadísticas...</p>;

  if (error) return (
    <div>
      <p style={{ color: '#fc8181' }}>{error}</p>
      <button className="login-btn" style={{ width: 'auto', marginTop: '10px' }}
        onClick={cargarEstadisticas}>Reintentar</button>
    </div>
  );

  const tarjetas = [
    { label: 'Total Citas',           valor: stats?.totalCitas    ?? 0, icono: '📅' },
    { label: 'Pacientes Registrados', valor: stats?.totalPacientes ?? 0, icono: '👥' },
    { label: 'Citas Canceladas',      valor: stats?.canceladas    ?? 0, icono: '❌' },
  ];

  return (
    <div>
      <h2 className="section-title">📊 Dashboard</h2>
      <div className="admin-cards">
        {tarjetas.map((t) => (
          <div className="admin-card" key={t.label}>
            <h3>{t.icono} {t.label}</h3>
            <p>{t.valor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardCards;