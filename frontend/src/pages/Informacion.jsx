import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  crearPaciente,
  buscarPacientePorCorreo
} from '../services/pacientes.service';
import { crearCita } from '../services/citas.service';
import '../styles/styles.css';

const Informacion = () => {

  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const servicios = JSON.parse(localStorage.getItem('servicios'));

  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [guardando, setGuardando] = useState(false);

  const hoy = new Date().toISOString().split('T')[0];

  /*
  |--------------------------------------------------------------------------
  | Guardar cita
  |--------------------------------------------------------------------------
  */

  const guardar = async () => {

    if (!fecha || !hora) {
      alert('Completa fecha y hora');
      return;
    }

    if (!usuario) {
      alert('No hay sesión activa. Vuelve al inicio.');
      navigate('/');
      return;
    }

    if (!servicios || servicios.length === 0) {
      alert('No hay servicios seleccionados.');
      navigate('/servicios');
      return;
    }

    setGuardando(true);

    try {

      /*
      |--------------------------------------------------------------------------
      | Buscar paciente existente
      | Backend devuelve 404 si no existe → axios lanza error → entra al catch
      | Backend devuelve 200 con data si existe → obtenemos el id
      |--------------------------------------------------------------------------
      */

      let pacienteId = null;

      try {

        const pacienteExistente =
          await buscarPacientePorCorreo(usuario.correo);

        pacienteId = pacienteExistente.id;

      } catch (errorBusqueda) {

        const esPacienteNuevo =
          errorBusqueda.response?.status === 404;

        if (!esPacienteNuevo) {
          throw errorBusqueda;
        }

        console.log('Paciente nuevo, se creará...');

      }

      /*
      |--------------------------------------------------------------------------
      | Crear paciente solo si no existe
      |--------------------------------------------------------------------------
      */

      if (!pacienteId) {

        const nuevoPaciente = {
          nombre: usuario.nombre,
          telefono: usuario.telefono,
          correo: usuario.correo,
          fecha_nacimiento: '2000-01-01'
        };

        const respuestaPaciente = await crearPaciente(nuevoPaciente);
        pacienteId = respuestaPaciente.data.id;

      }

      /*
      |--------------------------------------------------------------------------
      | Crear cita
      |--------------------------------------------------------------------------
      */

      const serviciosIds = servicios.map((s) => s.id);

      await crearCita({
        paciente_id: Number(pacienteId),
        fecha,
        hora_inicio: hora,
        servicios: serviciosIds,
        observaciones: 'Cita creada desde la app'
      });

      localStorage.setItem(
        'cita',
        JSON.stringify({ fecha, hora, servicios, paciente: usuario.nombre })
      );

      navigate('/resumen');

    } catch (error) {

      console.error(error);
      alert(error.response?.data?.message || 'Error al crear la cita');

    } finally {

      setGuardando(false);

    }

  };

  return (

    <div className="container">

      <div className="top"></div>

      <div className="content">

        <div className="nav">
          <div className="inactive">SERVICIOS</div>
          <div className="active">INFORMACIÓN</div>
          <div className="inactive">RESUMEN</div>
        </div>

        <h2>Información de cita</h2>

        <p>
          Paciente: <strong>{usuario?.nombre}</strong>
        </p>

        {servicios && servicios.length > 0 && (
          <p className="subtitle">
            Servicios: {servicios.map((s) => s.nombre).join(', ')}
          </p>
        )}

        <div className="input-group">
          <label>Fecha</label>
          <input
            type="date"
            value={fecha}
            min={hoy}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Hora</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
        </div>

        <button onClick={guardar} disabled={guardando}>
          {guardando ? 'Guardando...' : 'Confirmar cita'}
        </button>

      </div>

    </div>

  );

};

export default Informacion;