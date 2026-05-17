import { useEffect, useState } from 'react';

import {
  obtenerAgenda
} from '../services/citas.service';

import '../styles/styles.css';

function Agenda() {

  const [citas, setCitas] = useState([]);

  useEffect(() => {

    cargarAgenda();

  }, []);

  const cargarAgenda = async () => {

    try {

      const response =
        await obtenerAgenda();

      setCitas(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="container">

      <div className="top"></div>

      <div className="content">

        <h2>Agenda Dental</h2>

        {
          citas.map((cita) => (

            <div
              key={cita.id}
              className="card"
            >

              <h3>
                {cita.paciente_nombre}
              </h3>

              <p>
                Fecha: {cita.fecha}
              </p>

              <p>
                Hora: {cita.hora_inicio}
              </p>

              <p>
                Servicio:
                {' '}
                {cita.servicio_nombre}
              </p>

              <p>
                Estado:
                {' '}
                {cita.estado}
              </p>

            </div>
          ))
        }

      </div>

    </div>
  );
}

export default Agenda;