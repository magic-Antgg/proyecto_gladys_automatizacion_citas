import {
  useNavigate
} from 'react-router-dom';

import {
  useState
} from 'react';

import {
  crearPaciente,
  buscarPacientePorCorreo
} from '../services/pacientes.service';

import {
  crearCita
} from '../services/citas.service';

import '../styles/styles.css';

const Informacion = () => {

  const navigate = useNavigate();

  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  );

  const servicios = JSON.parse(
    localStorage.getItem('servicios')
  ) || [];

  const [fecha, setFecha] =
    useState('');

  const [hora, setHora] =
    useState('');

  const guardar = async () => {

    try {

      if (!fecha || !hora) {

        alert('Completa fecha y hora');
        return;
      }

      if (!usuario?.correo) {

        alert('No hay usuario cargado');
        return;
      }

      if (servicios.length === 0) {

        alert('Selecciona al menos un servicio');
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Buscar paciente existente
      |--------------------------------------------------------------------------
      */

      let pacienteId = null;

      const pacienteExistente =
        await buscarPacientePorCorreo(usuario.correo);

      if (pacienteExistente?.id) {

        pacienteId = pacienteExistente.id;

      } else {

        const nuevoPaciente = {

          nombre: usuario.nombre,

          telefono: usuario.telefono,

          correo: usuario.correo,

          fecha_nacimiento: '2000-01-01'

        };

        const pacienteCreado =
          await crearPaciente(nuevoPaciente);

        pacienteId = pacienteCreado.data.id;
      }

      /*
      |--------------------------------------------------------------------------
      | IDs de servicios
      |--------------------------------------------------------------------------
      */

      const serviciosIds =
        servicios.map((s) => s.id);

      /*
      |--------------------------------------------------------------------------
      | Crear cita
      |--------------------------------------------------------------------------
      */

      await crearCita({

        paciente_id: Number(pacienteId),

        fecha,

        hora_inicio: hora,

        servicios: serviciosIds,

        observaciones:
          'Cita creada desde frontend'

      });

      localStorage.setItem(
        'cita',
        JSON.stringify({
          nombre: usuario.nombre,
          correo: usuario.correo,
          fecha,
          hora,
          servicios
        })
      );

      alert('Cita creada correctamente');

      navigate('/resumen');

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        'Error al crear cita'
      );

    }

  };

  return (

    <div className="container">

      <div className="top"></div>

      <div className="content">

        <h2>
          Información de cita
        </h2>

        <p>
          Paciente: {usuario?.nombre}
        </p>

        <input
          type="date"
          value={fecha}
          onChange={(e) =>
            setFecha(e.target.value)
          }
        />

        <input
          type="time"
          value={hora}
          onChange={(e) =>
            setHora(e.target.value)
          }
        />

        <button onClick={guardar}>
          Confirmar cita
        </button>

      </div>

    </div>

  );

};

export default Informacion;