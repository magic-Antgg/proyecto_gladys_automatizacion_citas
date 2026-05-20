import { useEffect, useState } from 'react';
import axios from 'axios';

function TablaCitas() {

  const [citas, setCitas] = useState([]);

  const cargarCitas = async () => {

    try {

      const res = await axios.get(
        'http://localhost:3000/api/citas'
      );

      setCitas(res.data.data || []);

    } catch (error) {

      console.error(
        'Error cargando citas:',
        error
      );

    }

  };

  useEffect(() => {

    cargarCitas();

  }, []);

  const cancelarCita = async (id) => {

    try {

      await axios.patch(
        `http://localhost:3000/api/citas/${id}/cancelar`
      );

      cargarCitas();

    } catch (error) {

      console.error(
        'Error cancelando cita:',
        error
      );

    }

  };

  const actualizarCita = async (id) => {

    const nuevaFecha =
      prompt('Nueva fecha');

    const nuevaHora =
      prompt('Nueva hora');

    if (!nuevaFecha || !nuevaHora) return;

    try {

      await axios.patch(
        `http://localhost:3000/api/citas/${id}/reprogramar`,
        {
          fecha: nuevaFecha,
          hora: nuevaHora,
          hora_inicio: nuevaHora,
          estado: 'reprogramada'
        }
      );

      cargarCitas();

    } catch (error) {

      console.error(
        'Error reprogramando cita:',
        error
      );

    }

  };

  return (

    <div>

      <h2 className="section-title">
        📅 Citas
      </h2>

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

          {
            citas.map((cita) => (

              <tr key={cita.id}>

                <td>
                  {cita.paciente || cita.nombre || 'Sin nombre'}
                </td>

                <td>
                  {cita.fecha}
                </td>

                <td>
                  {cita.hora_inicio || cita.hora || '-'}
                </td>

                <td>
                  {cita.estado}
                </td>

                <td>

                  <button
                    className="btn-cancelar"
                    onClick={() =>
                      cancelarCita(cita.id)
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    className="btn-editar"
                    onClick={() =>
                      actualizarCita(cita.id)
                    }
                  >
                    Reprogramar
                  </button>

                </td>

              </tr>
            ))
          }

        </tbody>

      </table>

    </div>
  );
}

export default TablaCitas;