const { z } = require('zod');

/*
|--------------------------------------------------------------------------
| Validación de citas
|--------------------------------------------------------------------------
*/

const citaSchema = z.object({

  paciente_id: z.number(),

  fecha: z.string(),

  hora_inicio: z.string(),

  servicios: z
    .array(z.number())
    .min(1, 'Debe agregar al menos un servicio'),

  observaciones: z
    .string()
    .optional()

});

module.exports = {
  citaSchema
};