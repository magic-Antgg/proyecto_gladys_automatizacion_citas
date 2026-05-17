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

  if (error) {
    throw error;
  }

  const total = data.reduce((acumulador, servicio) => {

    return acumulador + servicio.duracion_minutos;

  }, 0);

  return total;
};

/*
|--------------------------------------------------------------------------
| Verificar conflictos
|--------------------------------------------------------------------------
*/

const verificarConflictoHorario = async (
  fecha,
  horaInicio,
  horaFin
) => {

  const { data, error } = await supabase
    .from('citas')
    .select('*')
    .eq('fecha', fecha)
    .neq('estado', 'cancelada');

  if (error) {
    throw error;
  }

  const conflicto = data.some((cita) => {

    return (
      horaInicio < cita.hora_fin &&
      horaFin > cita.hora_inicio
    );

  });

  return conflicto;
};

/*
|--------------------------------------------------------------------------
| Obtener agenda completa
|--------------------------------------------------------------------------
*/

const obtenerAgenda = async () => {

  const { data, error } = await supabase
    .from('agenda_detallada')
    .select('*')
    .order('fecha', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};

/*
|--------------------------------------------------------------------------
| Crear cita
|--------------------------------------------------------------------------
*/

const crearCita = async (cita) => {

  /*
  |--------------------------------------------------------------------------
  | Obtener duración total
  |--------------------------------------------------------------------------
  */

  const duracionTotal =
    await obtenerDuracionTotal(cita.servicios);

  /*
  |--------------------------------------------------------------------------
  | Calcular hora fin
  |--------------------------------------------------------------------------
  */

  const inicio = new Date(
    `${cita.fecha}T${cita.hora_inicio}`
  );

  const fin = new Date(
    inicio.getTime() + duracionTotal * 60000
  );

  const horaFin =
    fin.toTimeString().slice(0, 5);

  /*
  |--------------------------------------------------------------------------
  | Validar conflictos
  |--------------------------------------------------------------------------
  */

  const existeConflicto =
    await verificarConflictoHorario(
      cita.fecha,
      cita.hora_inicio,
      horaFin
    );

  if (existeConflicto) {

    throw new Error(
      'Ya existe una cita en ese horario'
    );

  }

  /*
  |--------------------------------------------------------------------------
  | Guardar cita
  |--------------------------------------------------------------------------
  */

  const { data: citaCreada, error: errorCita } =
    await supabase
      .from('citas')
      .insert([{
        paciente_id: cita.paciente_id,
        fecha: cita.fecha,
        hora_inicio: cita.hora_inicio,
        hora_fin: horaFin,
        estado: 'pendiente',
        observaciones: cita.observaciones || null
      }])
      .select()
      .single();

  if (errorCita) {
    throw errorCita;
  }

  /*
  |--------------------------------------------------------------------------
  | Guardar servicios de la cita
  |--------------------------------------------------------------------------
  */

  const serviciosRelacionados =
    cita.servicios.map((servicioId) => {

      return {
        cita_id: citaCreada.id,
        servicio_id: servicioId
      };

    });

  const { error: errorServicios } =
    await supabase
      .from('cita_servicios')
      .insert(serviciosRelacionados);

  if (errorServicios) {
    throw errorServicios;
  }

  return citaCreada;
};
/*
|--------------------------------------------------------------------------
| Cancelar cita
|--------------------------------------------------------------------------
*/

const cancelarCita = async (id) => {

  /*
  |--------------------------------------------------------------------------
  | Verificar existencia
  |--------------------------------------------------------------------------
  */

  const { data: cita, error: errorBusqueda } =
    await supabase
      .from('citas')
      .select('*')
      .eq('id', id)
      .single();

  if (errorBusqueda || !cita) {

    throw new Error(
      'La cita no existe'
    );

  }

  /*
  |--------------------------------------------------------------------------
  | Validar estado
  |--------------------------------------------------------------------------
  */

  if (cita.estado === 'cancelada') {

    throw new Error(
      'La cita ya fue cancelada'
    );

  }

  /*
  |--------------------------------------------------------------------------
  | Cancelar cita
  |--------------------------------------------------------------------------
  */

  const { data, error } = await supabase
    .from('citas')
    .update({
      estado: 'cancelada',
      cancelado_at: new Date()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
/*
|--------------------------------------------------------------------------
| Reprogramar cita
|--------------------------------------------------------------------------
*/

const reprogramarCita = async (
  id,
  nuevaFecha,
  nuevaHoraInicio
) => {

  /*
  |--------------------------------------------------------------------------
  | Buscar cita
  |--------------------------------------------------------------------------
  */

  const { data: cita, error: errorBusqueda } =
    await supabase
      .from('citas')
      .select(`
        *,
        cita_servicios (
          servicio_id
        )
      `)
      .eq('id', id)
      .single();

  if (errorBusqueda || !cita) {

    throw new Error(
      'La cita no existe'
    );

  }

  /*
  |--------------------------------------------------------------------------
  | Validar cancelación
  |--------------------------------------------------------------------------
  */

  if (cita.estado === 'cancelada') {

    throw new Error(
      'No puedes reprogramar una cita cancelada'
    );

  }

  /*
  |--------------------------------------------------------------------------
  | Obtener servicios
  |--------------------------------------------------------------------------
  */

  const servicios =
    cita.cita_servicios.map(
      (item) => item.servicio_id
    );

  /*
  |--------------------------------------------------------------------------
  | Calcular duración total
  |--------------------------------------------------------------------------
  */

  const duracionTotal =
    await obtenerDuracionTotal(servicios);

  /*
  |--------------------------------------------------------------------------
  | Calcular nueva hora fin
  |--------------------------------------------------------------------------
  */

  const inicio = new Date(
    `${nuevaFecha}T${nuevaHoraInicio}`
  );

  const fin = new Date(
    inicio.getTime() + duracionTotal * 60000
  );

  const nuevaHoraFin =
    fin.toTimeString().slice(0, 5);

  /*
  |--------------------------------------------------------------------------
  | Validar conflictos
  |--------------------------------------------------------------------------
  */

  const { data: citasExistentes } =
    await supabase
      .from('citas')
      .select('*')
      .eq('fecha', nuevaFecha)
      .neq('estado', 'cancelada')
      .neq('id', id);

  const conflicto =
    citasExistentes.some((citaExistente) => {

      return (
        nuevaHoraInicio < citaExistente.hora_fin &&
        nuevaHoraFin > citaExistente.hora_inicio
      );

    });

  if (conflicto) {

    throw new Error(
      'Ya existe una cita en ese horario'
    );

  }

  /*
  |--------------------------------------------------------------------------
  | Actualizar cita
  |--------------------------------------------------------------------------
  */

  const { data, error } = await supabase
    .from('citas')
    .update({
      fecha: nuevaFecha,
      hora_inicio: nuevaHoraInicio,
      hora_fin: nuevaHoraFin,
      estado: 'reprogramada'
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
module.exports = {
  crearCita,
  obtenerAgenda,
  cancelarCita,
  reprogramarCita
};