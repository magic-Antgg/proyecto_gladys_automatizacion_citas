import { useEffect, useState } from 'react';
import api from '../../services/api';

function AgendaVisual() {

  const [citas, setCitas]       = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => { cargarAgenda(); }, []);

  const cargarAgenda = async () => {
    try {
      setCargando(true);
      const res = await api.get('/citas');
      const data = res.data.data || [];
      // Ordenar por hora
      data.sort((a, b) => (a.hora_inicio > b.hora_inicio ? 1 : -1));
      setCitas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const colorEstado = (estado) => {
    if (estado === 'cancelada')    return '#fc8181';
    if (estado === 'completada')   return '#68d391';
    if (estado === 'reprogramada') return '#76e4f7';
    return '#2AA7C9';
  };

  if (cargando) return <p style={{ color: '#a0aec0', padding: '20px' }}>Cargando agenda...</p>;

  return (
    <div>
      <h2 className="section-title">🗓️ Agenda Visual</h2>

      {citas.length === 0
        ? <p style={{ color: '#c7d5e0' }}>No hay citas registradas.</p>
        : (
          <div className="agenda-lista">
            {citas.map((cita) => (
              <div key={cita.id} className="agenda-item"
                style={{ borderLeft: `4px solid ${colorEstado(cita.estado)}` }}>

                <div className="agenda-hora">{cita.hora_inicio || '—'}</div>

                <div className="agenda-info">
                  <strong>{cita.paciente_nombre || '—'}</strong>
                  <span>{cita.fecha}</span>
                  {cita.servicio_nombre && <span>🦷 {cita.servicio_nombre}</span>}
                  <span className="agenda-estado" style={{ color: colorEstado(cita.estado) }}>
                    {cita.estado}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

export default AgendaVisual;