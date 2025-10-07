import {z} from 'zod';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

export const EventSchema = z.object({
  id: z.string().uuid().default(() => uuidv4()),
  name: z.string().min(1).max(20),
  description: z.string().max(100).optional(),
  Cantidad: z.number().min(0.01),
 Fecha: z.string().refine(dateStr => dayjs(dateStr, 'YYYY-MM-DD', true).isValid, {
    message: 'Fecha debe tener formato YYYY-MM-DD válido',
  }),
  Tipo: z.string().refine(value => ['Ingreso', 'Egreso'].includes(value)),
});

  export type Event = z.infer<typeof EventSchema>;

  export const CreateEventSchema = EventSchema
 export type CreateEvent = z.infer<typeof CreateEventSchema>;

 export const UpdateEventSchema = EventSchema;

 export type UpdateEvent = z.infer<typeof UpdateEventSchema>;

 
