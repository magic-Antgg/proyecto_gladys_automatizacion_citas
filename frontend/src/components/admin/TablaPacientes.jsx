import { useEffect, useState } from 'react';
import axios from 'axios';

function TablaPacientes() {
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/pacientes')
      .then(res => setPacientes(res.data.data))
      .catch(err => console.error('Error cargando pacientes:', err));
  }, []);

  return (
    <div>
      <h2 className="section-title">👥 Pacientes</h2>

      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((paciente) => (
            <tr key={paciente.id}>
              <td>{paciente.nombre}</td>
              <td>{paciente.telefono}</td>
              <td>{paciente.correo}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default TablaPacientes;