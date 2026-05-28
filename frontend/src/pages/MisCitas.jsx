import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerMisCitas, cancelarMiCita } from '../services/misCitas.service';
import api from '../services/api';
import '../styles/styles.css';

const MisCitas = () => {

  const navigate  = useNavigate();
  const [citas, setCitas]     = useState([]);
  const [loading, setLoading] = useState(true);

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    if (!usuario) { navigate('/'); return; }
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      setLoading(true);
      const response = await obtenerMisCitas(usuario.id);
      setCitas(response.data || []);
    } catch (error) {
      console.error(error);
      alert('Error cargando citas');
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------
  | Cancelar cita
  |--------------------------------------------------
  */
  const cancelarCita = async (id) => {
    if (!window.confirm('¿Cancelar esta cita?')) return;
    try {
      await cancelarMiCita(id);
      await cargarCitas();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al cancelar');
    }
  };

  /*
  |--------------------------------------------------
  | Eliminar cita cancelada — solo del historial visual
  | Hace soft delete: activo = false
  |--------------------------------------------------
  */
  const eliminarCitaCancelada = async (id) => {
    if (!window.confirm('¿Eliminar esta cita de tu historial?')) return;
    try {
      await api.delete(`/citas/${id}`);
      // Quitar de la lista sin recargar
      setCitas((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Error al eliminar');
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/');
  };

  const colorEstado = (estado) => {
    const colores = {
      pendiente:    '#f6e05e',
      confirmada:   '#68d391',
      cancelada:    '#fc8181',
      completada:   '#90cdf4',
      reprogramada: '#76e4f7'
    };
    return colores[estado?.toLowerCase()] || '#CBD5E0';
  };

  return (
    <div className="container">
      <div className="top"></div>
      <div className="content">

        <h2>Mis Citas</h2>
        <p className="subtitle">
          Hola, <strong>{usuario?.nombre}</strong>
        </p>

        {loading && <p className="subtitle">Cargando...</p>}

        {!loading && citas.length === 0 && (
          <p className="subtitle">No tienes citas registradas.</p>
        )}

        {citas.map((cita) => (
          <div key={cita.id} className="card"
            style={{ marginBottom: '15px', textAlign: 'left' }}>

            <h3>{usuario?.nombre}</h3>
            <p>📅 {cita.fecha}</p>
            <p>🕐 {cita.hora_inicio}</p>
            <p>
              Estado:{' '}
              <span style={{
                background: colorEstado(cita.estado),
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#102A43'
              }}>
                {cita.estado}
              </span>
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>

              {/* Cancelar — solo si no está cancelada */}
              {cita.estado !== 'cancelada' && (
                <button
                  onClick={() => cancelarCita(cita.id)}
                  style={{
                    background: '#e74c3c',
                    width: 'auto',
                    padding: '8px 14px',
                    fontSize: '13px',
                    marginTop: 0
                  }}>
                  Cancelar cita
                </button>
              )}

              {/* Eliminar del historial — solo si está cancelada */}
              {cita.estado === 'cancelada' && (
                <button
                  onClick={() => eliminarCitaCancelada(cita.id)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #fc8181',
                    color: '#fc8181',
                    width: 'auto',
                    padding: '8px 14px',
                    fontSize: '13px',
                    marginTop: 0
                  }}>
                  🗑️ Eliminar del historial
                </button>
              )}

            </div>

          </div>
        ))}

        <button onClick={() => navigate('/servicios')}>
          Nueva cita
        </button>

        <button className="btn-regresar" onClick={cerrarSesion}>
          Cerrar sesión
        </button>

      </div>
    </div>
  );
};

export default MisCitas;