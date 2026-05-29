const supabase = require('../config/supabase');

/*
|--------------------------------------------------------------------------
| Obtener duración total de servicios
|--------------------------------------------------------------------------
*/
const obtenerDuracionTotal = async (servicios) => {
  const { data, error } = await supabase
    .from('servicios')
    .select('id, duracion_minutos')
    .in('id', servicios);
  if (error) throw error;
  const total = data.reduce((acc, s) => acc + (s.duracion_minutos || 30), 0);
  return total;
};

/*
|--------------------------------------------------------------------------
| Verificar conflictos de horario
|--------------------------------------------------------------------------
*/
const verificarConflictoHorario = async (fecha, horaInicio, horaFin) => {
  const { data, error } = await supabase
    .from('citas')
    .select('*')
    .eq('fecha', fecha)
    .neq('estado', 'cancelada');
  if (error) throw error;
  return data.some((c) => horaInicio < c.hora_fin && horaFin > c.hora_inicio);
};

/*
|--------------------------------------------------------------------------
| Obtener agenda completa — usa vista agenda_detallada
| que tiene paciente_nombre y servicio_nombre
|--------------------------------------------------------------------------
*/
const obtenerAgenda = async () => {
  const { data, error } = await supabase
    .from('agenda_detallada')
    .select('*')
    .order('fecha', { ascending: true });
  if (error) throw error;
  return data;
};

/*
|--------------------------------------------------------------------------
| Crear cita — incluye usuario_id
|--------------------------------------------------------------------------
*/
const crearCita = async (cita) => {

  const duracionTotal = await obtenerDuracionTotal(cita.servicios);

  const inicio = new Date(`${cita.fecha}T${cita.hora_inicio}`);
  const fin    = new Date(inicio.getTime() + duracionTotal * 60000);
  const horaFin = fin.toTimeString().slice(0, 5);

  const existeConflicto = await verificarConflictoHorario(
    cita.fecha, cita.hora_inicio, horaFin
  );
  if (existeConflicto) throw new Error('Ya existe una cita en ese horario');

  const { data: citaCreada, error: errorCita } = await supabase
    .from('citas')
    .insert([{
      paciente_id:   cita.paciente_id,
      usuario_id:    cita.usuario_id || null,
      fecha:         cita.fecha,
      hora_inicio:   cita.hora_inicio,
      hora_fin:      horaFin,
      estado:        'pendiente',
      observaciones: cita.observaciones || null
    }])
    .select()
    .single();

  if (errorCita) throw errorCita;

  const serviciosRelacionados = cita.servicios.map((servicioId) => ({
    cita_id:     citaCreada.id,
    servicio_id: servicioId
  }));

  const { error: errorServicios } = await supabase
    .from('cita_servicios')
    .insert(serviciosRelacionados);

  if (errorServicios) throw errorServicios;

  return citaCreada;
};

/*
|--------------------------------------------------------------------------
| Cancelar cita
|--------------------------------------------------------------------------
*/
const cancelarCita = async (id) => {
  const { data: cita, error: errorBusqueda } = await supabase
    .from('citas').select('*').eq('id', id).single();
  if (errorBusqueda || !cita) throw new Error('La cita no existe');
  if (cita.estado === 'cancelada') throw new Error('La cita ya fue cancelada');

  const { data, error } = await supabase
    .from('citas')
    .update({ estado: 'cancelada', cancelado_at: new Date() })
    .eq('id', id).select().single();
  if (error) throw error;
  return data;
};

/*
|--------------------------------------------------------------------------
| Reprogramar cita
|--------------------------------------------------------------------------
*/
const reprogramarCita = async (id, nuevaFecha, nuevaHoraInicio) => {
  const { data: cita, error: errorBusqueda } = await supabase
    .from('citas')
    .select('*, cita_servicios(servicio_id)')
    .eq('id', id).single();
  if (errorBusqueda || !cita) throw new Error('La cita no existe');
  if (cita.estado === 'cancelada') throw new Error('No puedes reprogramar una cita cancelada');

  const servicios = cita.cita_servicios.map((item) => item.servicio_id);
  const duracionTotal = await obtenerDuracionTotal(servicios);

  const inicio = new Date(`${nuevaFecha}T${nuevaHoraInicio}`);
  const fin    = new Date(inicio.getTime() + duracionTotal * 60000);
  const nuevaHoraFin = fin.toTimeString().slice(0, 5);

  const { data: citasExistentes } = await supabase
    .from('citas').select('*')
    .eq('fecha', nuevaFecha)
    .neq('estado', 'cancelada')
    .neq('id', id);

  const conflicto = citasExistentes?.some((c) =>
    nuevaHoraInicio < c.hora_fin && nuevaHoraFin > c.hora_inicio
  );
  if (conflicto) throw new Error('Ya existe una cita en ese horario');

  const { data, error } = await supabase
    .from('citas')
    .update({ fecha: nuevaFecha, hora_inicio: nuevaHoraInicio, hora_fin: nuevaHoraFin, estado: 'reprogramada' })
    .eq('id', id).select().single();
  if (error) throw error;
  return data;
};

module.exports = { crearCita, obtenerAgenda, cancelarCita, reprogramarCita };