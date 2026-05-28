const { z } = require('zod');

const citaSchema = z.object({

  paciente_id: z.number(),

  // FIX: usuario_id agregado como opcional
  usuario_id: z.string().optional().nullable(),

  fecha: z.string(),

  hora_inicio: z.string(),

  servicios: z
    .array(z.number())
    .min(1, 'Debe agregar al menos un servicio'),

  observaciones: z.string().optional()

});

module.exports = { citaSchema };