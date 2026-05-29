import { useEffect, useState } from 'react';
import api from '../../services/api';

const ROLES = [
  { valor: 'admin',         label: '👑 Administrador',  descripcion: 'Acceso completo al sistema' },
  { valor: 'dentista',      label: '🦷 Dentista',        descripcion: 'Ve agenda y pacientes' },
  { valor: 'recepcionista', label: '📋 Recepcionista',   descripcion: 'Gestiona citas y pacientes' },
];

function GestionUsuarios() {

  const [usuarios, setUsuarios]   = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    nombre: '', correo: '', telefono: '', password: '', rol: 'recepcionista'
  });

  useEffect(() => { cargarUsuarios(); }, []);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const res = await api.get('/auth/usuarios');
      setUsuarios(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const crearUsuario = async () => {
    if (!form.nombre || !form.correo || !form.password) {
      alert('Nombre, correo y contraseña son obligatorios');
      return;
    }
    if (form.password.length < 6) {
      alert('La contraseña debe tener mínimo 6 caracteres');
      return;
    }
    setGuardando(true);
    try {
      await api.post('/auth/crear-usuario', form);
      setForm({ nombre: '', correo: '', telefono: '', password: '', rol: 'recepcionista' });
      await cargarUsuarios();
      alert('Usuario creado correctamente');
    } catch (error) {
      alert(error.response?.data?.message || 'Error al crear usuario');
    } finally {
      setGuardando(false);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Desactivar este usuario?')) return;
    try {
      await api.delete(`/auth/usuarios/${id}`);
      await cargarUsuarios();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al eliminar');
    }
  };

  const colorRol = (rol) => {
    const colores = {
      admin:         { bg: '#f6e05e', color: '#744210' },
      dentista:      { bg: '#68d391', color: '#1a4731' },
      recepcionista: { bg: '#76e4f7', color: '#065666' },
      paciente:      { bg: '#a0aec0', color: '#1a202c' },
    };
    return colores[rol] || { bg: '#e2e8f0', color: '#2d3748' };
  };

  return (
    <div>
      <h2 className="section-title">👤 Gestión de Usuarios</h2>

      {/* Formulario nuevo usuario */}
      <div className="admin-card" style={{ marginBottom: '30px', maxWidth: '500px' }}>
        <h3 style={{ marginBottom: '16px' }}>➕ Nuevo usuario del sistema</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          <div>
            <label style={{ color: '#c7d5e0', display: 'block', marginBottom: '4px' }}>Nombre *</label>
            <input className="login-input" type="text" placeholder="Nombre completo"
              value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>

          <div>
            <label style={{ color: '#c7d5e0', display: 'block', marginBottom: '4px' }}>Correo *</label>
            <input className="login-input" type="email" placeholder="correo@ejemplo.com"
              value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
          </div>

          <div>
            <label style={{ color: '#c7d5e0', display: 'block', marginBottom: '4px' }}>Teléfono</label>
            <input className="login-input" type="text" placeholder="10 dígitos"
              value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          </div>

          <div>
            <label style={{ color: '#c7d5e0', display: 'block', marginBottom: '4px' }}>Contraseña *</label>
            <input className="login-input" type="password" placeholder="Mínimo 6 caracteres"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>

          <div>
            <label style={{ color: '#c7d5e0', display: 'block', marginBottom: '8px' }}>Rol *</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ROLES.map((r) => (
                <label key={r.valor} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  cursor: 'pointer', padding: '10px', borderRadius: '8px',
                  background: form.rol === r.valor ? 'rgba(42,167,201,0.2)' : 'rgba(255,255,255,0.05)',
                  border: form.rol === r.valor ? '1px solid #2aa7c9' : '1px solid transparent'
                }}>
                  <input type="radio" name="rol" value={r.valor}
                    checked={form.rol === r.valor}
                    onChange={(e) => setForm({ ...form, rol: e.target.value })} />
                  <div>
                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{r.label}</div>
                    <div style={{ color: '#c7d5e0', fontSize: '12px' }}>{r.descripcion}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button className="login-btn" onClick={crearUsuario} disabled={guardando} style={{ marginTop: '8px' }}>
            {guardando ? 'Creando...' : 'Crear Usuario'}
          </button>

        </div>
      </div>

      {/* Tabla de usuarios */}
      <h3 style={{ color: '#c7d5e0', marginBottom: '16px' }}>Usuarios del sistema</h3>

      {cargando ? (
        <p style={{ color: '#a0aec0' }}>Cargando usuarios...</p>
      ) : usuarios.length === 0 ? (
        <p style={{ color: '#c7d5e0' }}>No hay usuarios registrados.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.filter(u => u.rol !== 'paciente').map((usuario) => {
                const c = colorRol(usuario.rol);
                return (
                  <tr key={usuario.id}>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.telefono || '—'}</td>
                    <td>
                      <span style={{
                        background: c.bg, color: c.color,
                        padding: '3px 10px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: 'bold'
                      }}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td>
                      {usuario.rol !== 'admin' && (
                        <button className="btn-cancelar" onClick={() => eliminarUsuario(usuario.id)}>
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GestionUsuarios;