import { useEffect, useState } from 'react';
import axios from 'axios';

function AgendaVisual() {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/citas')
      .then(res => setCitas(res.data.data))
      .catch(err => console.error('Error cargando agenda:', err));
  }, []);

  const getColorEstado = (estado) => {
    if (estado === 'cancelada') return '#fc8181';
    if (estado === 'completada') return '#68d391';
    return '#4f8ef7';
  };

  return (
    <div>
      <h2 className="section-title">🗓️ Agenda Visual</h2>

      <div className="agenda-lista">
        {citas.length === 0 && (
          <p style={{ color: '#718096' }}>No hay citas registradas.</p>
        )}

        {citas.map((cita) => (
          <div
            key={cita.id}
            className="agenda-item"
            style={{ borderLeft: `4px solid ${getColorEstado(cita.estado)}` }}
          >
            <div className="agenda-hora">
              {cita.hora_inicio}
            </div>
            <div className="agenda-info">
              <strong>{cita.paciente}</strong>
              <span>{cita.fecha}</span>
              <span
                className="agenda-estado"
                style={{ color: getColorEstado(cita.estado) }}
              >
                {cita.estado}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgendaVisual;