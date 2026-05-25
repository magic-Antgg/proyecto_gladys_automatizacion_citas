import { useEffect, useState } from 'react';
import api from '../../services/api';

function ServiciosAdmin() {

  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [editando, setEditando]   = useState(null);

  const [form, setForm] = useState({ nombre: '', precio: '', duracion_minutos: '' });

  useEffect(() => { cargarServicios(); }, []);

  const cargarServicios = async () => {
    try {
      setCargando(true);
      const res = await api.get('/servicios');
      setServicios(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setCargando(false); }
  };

  const abrirNuevo = () => {
    setEditando(null);
    setForm({ nombre: '', precio: '', duracion_minutos: '' });
  };

  const abrirEditar = (s) => {
    setEditando(s);
    setForm({ nombre: s.nombre || '', precio: s.precio || '', duracion_minutos: s.duracion_minutos || '' });
  };

  const guardar = async () => {
    if (!form.nombre || !form.precio) { alert('Nombre y precio son obligatorios'); return; }
    setGuardando(true);
    try {
      const datos = { nombre: form.nombre, precio: Number(form.precio), duracion_minutos: Number(form.duracion_minutos) || 30, activo: true };
      if (editando) {
        await api.put(`/servicios/${editando.id}`, datos);
      } else {
        await api.post('/servicios', datos);
      }
      abrirNuevo();
      await cargarServicios();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar');
    } finally { setGuardando(false); }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este servicio?')) return;
    try {
      await api.delete(`/servicios/${id}`);
      await cargarServicios();
    } catch (err) { alert(err.response?.data?.message || 'Error al eliminar'); }
  };

  return (
    <div>
      <h2 className="section-title">🦷 Servicios Dentales</h2>

      {/* Formulario */}
      <div className="admin-card" style={{ marginBottom: '30px', maxWidth: '500px' }}>
        <h3 style={{ marginBottom: '16px' }}>{editando ? '✏️ Editar servicio' : '➕ Nuevo servicio'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ color: '#c7d5e0', display: 'block', marginBottom: '4px' }}>Nombre *</label>
            <input className="login-input" type="text" placeholder="Ej: Limpieza Dental"
              value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div>
            <label style={{ color: '#c7d5e0', display: 'block', marginBottom: '4px' }}>Precio (MXN) *</label>
            <input className="login-input" type="number" placeholder="Ej: 600"
              value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
          </div>
          <div>
            <label style={{ color: '#c7d5e0', display: 'block', marginBottom: '4px' }}>Duración (minutos)</label>
            <input className="login-input" type="number" placeholder="Ej: 30"
              value={form.duracion_minutos} onChange={(e) => setForm({ ...form, duracion_minutos: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button className="login-btn" onClick={guardar} disabled={guardando}>
              {guardando ? 'Guardando...' : editando ? 'Actualizar' : 'Crear servicio'}
            </button>
            {editando && (
              <button className="btn-cancelar" style={{ flex: 1, marginTop: 0 }} onClick={abrirNuevo}>Cancelar</button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      {cargando ? (
        <p style={{ color: '#a0aec0' }}>Cargando servicios...</p>
      ) : servicios.length === 0 ? (
        <p style={{ color: '#c7d5e0' }}>No hay servicios registrados.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="tabla">
            <thead>
              <tr><th>Nombre</th><th>Precio</th><th>Duración</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {servicios.map((s) => (
                <tr key={s.id}>
                  <td>{s.nombre}</td>
                  <td>${s.precio}</td>
                  <td>{s.duracion_minutos ? `${s.duracion_minutos} min` : '—'}</td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-editar" onClick={() => abrirEditar(s)}>Editar</button>
                    <button className="btn-cancelar" onClick={() => eliminar(s.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ServiciosAdmin;