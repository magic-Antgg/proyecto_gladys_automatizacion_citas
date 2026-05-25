import { useEffect, useState } from 'react';
import api from '../../services/api';

function TablaPacientes() {

  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [nuevoPaciente, setNuevoPaciente] = useState({
    nombre: '', telefono: '', correo: '', fecha_nacimiento: ''
  });

  const [modalEditar, setModalEditar] = useState(false);
  const [pacienteEdit, setPacienteEdit] = useState(null);
  const [formEdit, setFormEdit] = useState({ nombre: '', telefono: '', correo: '' });

  useEffect(() => { obtenerPacientes(); }, []);

  const obtenerPacientes = async () => {
    try {
      setCargando(true);
      const res = await api.get('/pacientes');
      setPacientes(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const crearPaciente = async () => {
    if (!nuevoPaciente.nombre || !nuevoPaciente.telefono || !nuevoPaciente.correo) {
      alert('Nombre, teléfono y correo son obligatorios');
      return;
    }
    setGuardando(true);
    try {
      await api.post('/pacientes', nuevoPaciente);
      setNuevoPaciente({ nombre: '', telefono: '', correo: '', fecha_nacimiento: '' });
      await obtenerPacientes();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al crear paciente');
    } finally {
      setGuardando(false);
    }
  };

  const abrirEditar = (paciente) => {
    setPacienteEdit(paciente);
    setFormEdit({ nombre: paciente.nombre || '', telefono: paciente.telefono || '', correo: paciente.correo || '' });
    setModalEditar(true);
  };

  const confirmarEditar = async () => {
    if (!formEdit.nombre || !formEdit.telefono || !formEdit.correo) {
      alert('Completa todos los campos');
      return;
    }
    setGuardando(true);
    try {
      await api.put(`/pacientes/${pacienteEdit.id}`, formEdit);
      setModalEditar(false);
      await obtenerPacientes();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al actualizar');
    } finally {
      setGuardando(false);
    }
  };

  // Soft delete — no borra físicamente, solo desactiva
  const eliminarPaciente = async (id) => {
    if (!window.confirm('¿Desactivar este paciente? Sus citas se conservarán.')) return;
    try {
      await api.delete(`/pacientes/${id}`);
      await obtenerPacientes();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al eliminar');
    }
  };

  return (
    <div>
      <h2 className="section-title">👥 Pacientes</h2>

      {/* Formulario nuevo paciente */}
      <div className="admin-card" style={{ marginBottom: '25px' }}>
        <h3 style={{ marginBottom: '15px' }}>Nuevo Paciente</h3>
        <input className="login-input" type="text" placeholder="Nombre"
          value={nuevoPaciente.nombre}
          onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, nombre: e.target.value })} />
        <br /><br />
        <input className="login-input" type="text" placeholder="Teléfono"
          value={nuevoPaciente.telefono}
          onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, telefono: e.target.value })} />
        <br /><br />
        <input className="login-input" type="email" placeholder="Correo"
          value={nuevoPaciente.correo}
          onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, correo: e.target.value })} />
        <br /><br />
        <input className="login-input" type="date"
          value={nuevoPaciente.fecha_nacimiento}
          onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, fecha_nacimiento: e.target.value })} />
        <button className="login-btn" style={{ marginTop: '15px' }}
          onClick={crearPaciente} disabled={guardando}>
          {guardando ? 'Guardando...' : 'Crear Paciente'}
        </button>
      </div>

      {/* Tabla */}
      {cargando ? (
        <p style={{ color: '#a0aec0' }}>Cargando pacientes...</p>
      ) : pacientes.length === 0 ? (
        <p style={{ color: '#c7d5e0' }}>No hay pacientes registrados.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th><th>Teléfono</th><th>Correo</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente) => (
                <tr key={paciente.id}>
                  <td>{paciente.nombre}</td>
                  <td>{paciente.telefono}</td>
                  <td>{paciente.correo}</td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-editar" onClick={() => abrirEditar(paciente)}>Editar</button>
                    <button className="btn-cancelar" onClick={() => eliminarPaciente(paciente.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal editar */}
      {modalEditar && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setModalEditar(false)}>
          <div style={{
            background: '#173F5F', borderRadius: '16px', padding: '30px',
            width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '14px'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: 'white', margin: 0 }}>Editar paciente</h3>
            <div>
              <label style={{ color: '#c7d5e0', display: 'block', marginBottom: '4px' }}>Nombre</label>
              <input className="login-input" type="text" value={formEdit.nombre}
                onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })} />
            </div>
            <div>
              <label style={{ color: '#c7d5e0', display: 'block', marginBottom: '4px' }}>Teléfono</label>
              <input className="login-input" type="text" value={formEdit.telefono}
                onChange={(e) => setFormEdit({ ...formEdit, telefono: e.target.value })} />
            </div>
            <div>
              <label style={{ color: '#c7d5e0', display: 'block', marginBottom: '4px' }}>Correo</label>
              <input className="login-input" type="email" value={formEdit.correo}
                onChange={(e) => setFormEdit({ ...formEdit, correo: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button className="login-btn" onClick={confirmarEditar} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button className="btn-cancelar" style={{ flex: 1, marginTop: 0 }} onClick={() => setModalEditar(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TablaPacientes;