const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const authService = require('../services/auth.service');
const supabase    = require('../config/supabase');

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({ ok: false, message: 'Correo y contraseña son obligatorios' });
    }

    const usuario = await authService.loginUsuario(correo);
    if (!usuario) return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) return res.status(401).json({ ok: false, message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ ok: true, token, usuario });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| REGISTER — para pacientes desde la app
|--------------------------------------------------------------------------
*/
const register = async (req, res) => {
  try {
    const { nombre, correo, telefono, password } = req.body;
    if (!nombre || !correo || !telefono || !password) {
      return res.status(400).json({ ok: false, message: 'Todos los campos son obligatorios' });
    }

    const { data: existente } = await supabase
      .from('usuarios').select('id').eq('correo', correo).maybeSingle();
    if (existente) return res.status(409).json({ ok: false, message: 'Ya existe una cuenta con ese correo' });

    const passwordHash = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, correo, telefono, password: passwordHash, rol: 'paciente' }])
      .select().single();

    if (error) return res.status(400).json({ ok: false, message: error.message });

    const token = jwt.sign(
      { id: data.id, correo: data.correo, rol: data.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ ok: true, token, usuario: data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| CREAR USUARIO — para admin/dentista/recepcionista desde panel admin
|--------------------------------------------------------------------------
*/
const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, telefono, password, rol } = req.body;

    if (!nombre || !correo || !password || !rol) {
      return res.status(400).json({ ok: false, message: 'Nombre, correo, contraseña y rol son obligatorios' });
    }

    const rolesPermitidos = ['admin', 'dentista', 'recepcionista'];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ ok: false, message: 'Rol no válido' });
    }

    const { data: existente } = await supabase
      .from('usuarios').select('id').eq('correo', correo).maybeSingle();
    if (existente) return res.status(409).json({ ok: false, message: 'Ya existe un usuario con ese correo' });

    const passwordHash = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, correo, telefono: telefono || null, password: passwordHash, rol }])
      .select().single();

    if (error) return res.status(400).json({ ok: false, message: error.message });

    res.status(201).json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| OBTENER USUARIOS — para panel admin
|--------------------------------------------------------------------------
*/
const obtenerUsuarios = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, correo, telefono, rol, activo, created_at')
      .eq('activo', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| ELIMINAR USUARIO — soft delete
|--------------------------------------------------------------------------
*/
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('usuarios').update({ activo: false }).eq('id', id);
    if (error) throw error;
    res.json({ ok: true, message: 'Usuario desactivado' });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

module.exports = { login, register, crearUsuario, obtenerUsuarios, eliminarUsuario };