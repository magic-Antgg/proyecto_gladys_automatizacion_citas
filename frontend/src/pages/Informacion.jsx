import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { crearPaciente, buscarPacientePorCorreo } from '../services/pacientes.service';
import { crearCita } from '../services/citas.service';
import '../styles/styles.css';

const Informacion = () => {

  const navigate = useNavigate();

  const usuario  = JSON.parse(localStorage.getItem('usuario')) || {};
  const servicios = JSON.parse(localStorage.getItem('servicios')) || [];

  const [fecha, setFecha]       = useState('');
  const [hora, setHora]         = useState('');
  const [guardando, setGuardando] = useState(false);

  const hoy = new Date().toISOString().split('T')[0];

  const guardar = async () => {

    if (!fecha || !hora) { alert('Completa fecha y hora'); return; }
    if (!usuario?.correo) { alert('Sesión no válida'); navigate('/'); return; }
    if (servicios.length === 0) { alert('Selecciona al menos un servicio'); navigate('/servicios'); return; }

    setGuardando(true);

    try {

      // 1. Buscar si el paciente ya existe
      let pacienteId = null;

      try {
        const pacienteExistente = await buscarPacientePorCorreo(usuario.correo);
        pacienteId = pacienteExistente?.id ?? null;
      } catch (err) {
        // 404 = paciente nuevo, cualquier otro error lo propagamos
        if (err.response?.status !== 404) throw err;
      }

      // 2. Crear paciente solo si no existe
      if (!pacienteId) {
        const respuesta = await crearPaciente({
          nombre: usuario.nombre,
          telefono: usuario.telefono,
          correo: usuario.correo,
          fecha_nacimiento: '2000-01-01'
        });
        pacienteId = respuesta.data.id;
      }

      // 3. Crear cita
      await crearCita({
        paciente_id: Number(pacienteId),
        fecha,
        hora_inicio: hora,
        servicios: servicios.map((s) => s.id),
        observaciones: 'Cita creada desde la app'
      });

      // 4. Guardar resumen y navegar
      localStorage.setItem('cita', JSON.stringify({
        nombre: usuario.nombre,
        correo: usuario.correo,
        fecha,
        hora,
        servicios
      }));

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
        <p>Paciente: <strong>{usuario?.nombre}</strong></p>

        {servicios.length > 0 && (
          <p className="subtitle">
            Servicios: {servicios.map((s) => s.nombre).join(', ')}
          </p>
        )}

        <input
          type="date"
          value={fecha}
          min={hoy}
          onChange={(e) => setFecha(e.target.value)}
        />

        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
        />

        <button onClick={guardar} disabled={guardando}>
          {guardando ? 'Guardando...' : 'Confirmar cita'}
        </button>

        <button className="btn-regresar" onClick={() => navigate('/servicios')}>
          ← Regresar
        </button>
      </div>
    </div>
  );
};

export default Informacion;