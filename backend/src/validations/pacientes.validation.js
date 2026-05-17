const { z } = require('zod');

/*
|--------------------------------------------------------------------------
| Validación paciente
|--------------------------------------------------------------------------
*/

const pacienteSchema = z.object({

  nombre: z
    .string()
    .min(3, 'El nombre es obligatorio')
    .max(100),

  telefono: z
    .string()
    .min(10, 'Teléfono inválido')
    .max(15),

  correo: z
    .string()
    .email('Correo inválido'),

  fecha_nacimiento: z
    .string()

});

module.exports = {
  pacienteSchema
};