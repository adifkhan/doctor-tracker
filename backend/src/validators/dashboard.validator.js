import { z } from 'zod';
import { optional } from './common.js';

export const statsQuery = z.object({
  days: optional(z.coerce.number().pipe(z.union([z.literal(7), z.literal(30), z.literal(90)]))).default(30),
});
