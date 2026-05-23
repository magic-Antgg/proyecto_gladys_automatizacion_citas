import { useEffect, useState } from 'react';
import api from '../../services/api';

function TablaCitas() {

  const [citas, setCitas]           = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [modal, setModal]           = useState(false);
  const [citaSel, setCitaSel]       = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevaHora, setNuevaHora]   = useState('');
  const [guardando, setGuardando]   = useState(false);

  useEffect(() => { cargarCitas(); }, []);

  const cargarCitas = async () => {
    try {
      setCargando(true);
      const res = await api.get('/citas');
      setCitas(res.data.data || []);
    } catch (err) {
      console.error('Error cargando citas:', err);
    } finally {
      setCargando(false);
    }
  };

  const cancelarCita = async (id) => {
    if (!window.confirm('¿Cancelar esta cita?')) return;
    try {
      await api.patch(`/citas/${id}/cancelar`);
      await cargarCitas();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al cancelar');
    }
  };

  const abrirModal = (cita) => {
    setCitaSel(cita);
    setNuevaFecha(cita.fecha || '');
    setNuevaHora(cita.hora_inicio || '');
    setModal(true);
  };

  const confirmarReprogramar = async () => {
    if (!nuevaFecha || !nuevaHora) { alert('Completa fecha y hora'); return; }
    setGuardando(true);
    try {
      await api.patch(`/citas/${citaSel.id}/reprogramar`, {
        fecha: nuevaFecha,
        hora_inicio: nuevaHora
      });
      setModal(false);
      await cargarCitas();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al reprogramar');
    } finally {
      setGuardando(false);
    }
  };

  const badgeEstado = (estado) => {
    const mapa = {
      pendiente:    { bg: '#f6e05e', color: '#744210' },
      confirmada:   { bg: '#68d391', color: '#1a4731' },
      cancelada:    { bg: '#fc8181', color: '#63171b' },
      completada:   { bg: '#a0aec0', color: '#1a202c' },
      reprogramada: { bg: '#76e4f7', color: '#065666' },
    };
    const s = mapa[estado?.toLowerCase()] || { bg: '#e2e8f0', color: '#2d3748' };
    return (
      <span style={{
        background: s.bg, color: s.color,
        padding: '3px 10px', borderRadius: '20px',
        fontSize: '12px', fontWeight: 'bold'
      }}>
        {estado}
      </span>
    );
  };

  if (cargando) return <p style={{ color: '#a0aec0', padding: '20px' }}>Cargando citas...</p>;

  return (
    <>
      <h2 className="section-title">📅 Citas</h2>

      {citas.length === 0
        ? <p style={{ color: '#c7d5e0' }}>No hay citas registradas.</p>
        : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tabla">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Servicio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((cita) => (
                  <tr key={cita.id}>
                    <td>{cita.paciente_nombre || '—'}</td>
                    <td>{cita.fecha}</td>
                    <td>{cita.hora_inicio || '—'}</td>
                    <td>{cita.servicio_nombre || '—'}</td>
                    <td>{badgeEstado(cita.estado)}</td>
                    <td style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {cita.estado !== 'cancelada' && (
                        <>
                          <button className="btn-cancelar" onClick={() => cancelarCita(cita.id)}>
                            Cancelar
                          </button>
                          <button className="btn-editar" onClick={() => abrirModal(cita)}>
                            Reprogramar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      {/* Modal reprogramar */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setModal(false)}>
          <div style={{
            background: '#173F5F', borderRadius: '16px',
            padding: '30px', width: '100%', maxWidth: '400px',
            display: 'flex', flexDirection: 'column', gap: '16px'
          }} onClick={(e) => e.stopPropagation()}>

            <h3 style={{ color: 'white', margin: 0 }}>Reprogramar cita</h3>
            <p style={{ color: '#c7d5e0', margin: 0 }}>
              {citaSel?.paciente_nombre}
            </p>

            <div>
              <label style={{ color: '#c7d5e0', display: 'block', marginBottom: '6px' }}>Nueva fecha</label>
              <input className="login-input" type="date"
                value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} />
            </div>

            <div>
              <label style={{ color: '#c7d5e0', display: 'block', marginBottom: '6px' }}>Nueva hora</label>
              <input className="login-input" type="time"
                value={nuevaHora} onChange={(e) => setNuevaHora(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="login-btn" onClick={confirmarReprogramar} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Confirmar'}
              </button>
              <button className="btn-cancelar" style={{ flex: 1, marginTop: 0 }} onClick={() => setModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TablaCitas;