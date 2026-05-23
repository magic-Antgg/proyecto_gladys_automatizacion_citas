import { useEffect, useState } from 'react';
import { obtenerAgenda } from '../services/citas.service';
import '../styles/styles.css';

function Agenda() {

  const [citas, setCitas]       = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => { cargarAgenda(); }, []);

  const cargarAgenda = async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await obtenerAgenda();
      setCitas(response.data || []);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la agenda.');
    } finally {
      setCargando(false);
    }
  };

  const colorEstado = (estado) => {
    const mapa = {
      pendiente:  '#f6e05e',
      confirmada: '#68d391',
      cancelada:  '#fc8181',
      completada: '#a0aec0'
    };
    return mapa[estado?.toLowerCase()] || '#c7d5e0';
  };

  return (
    <div className="container">
      <div className="top"></div>
      <div className="content">

        <h2>Agenda Dental</h2>

        {cargando && <p className="subtitle">Cargando agenda...</p>}
        {error    && <p className="subtitle">{error}</p>}

        {!cargando && !error && citas.length === 0 && (
          <p className="subtitle">No hay citas registradas.</p>
        )}

        {citas.map((cita) => (
          <div key={cita.id} className="card" style={{ marginBottom: '12px', textAlign: 'left' }}>
            <h3>{cita.paciente_nombre}</h3>
            <p>📅 {cita.fecha}</p>
            <p>🕐 {cita.hora_inicio}</p>
            <p>🦷 {cita.servicio_nombre}</p>
            <p>
              Estado:{' '}
              <span style={{
                background: colorEstado(cita.estado),
                color: '#102A43',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {cita.estado}
              </span>
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Agenda;