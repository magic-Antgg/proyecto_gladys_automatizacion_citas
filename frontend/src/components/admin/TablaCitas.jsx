import { useEffect, useState } from 'react';
import axios from 'axios';

function TablaCitas() {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = () => {
    axios.get('http://localhost:3000/api/citas')
      .then(res => setCitas(res.data.data))
      .catch(err => console.error('Error cargando citas:', err));
  };

  const cancelarCita = (id) => {
    axios.patch(`http://localhost:3000/api/citas/${id}/cancelar`)
      .then(() => cargarCitas())
      .catch(err => console.error('Error cancelando cita:', err));
  };

  return (
    <div>
      <h2 className="section-title">📅 Citas</h2>

      <table className="tabla">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.id}>
              <td>{cita.paciente}</td>
              <td>{cita.fecha}</td>
              <td>{cita.hora_inicio}</td>
              <td>{cita.estado}</td>
              <td>
                <button
                  className="btn-cancelar"
                  onClick={() => cancelarCita(cita.id)}
                >
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default TablaCitas;