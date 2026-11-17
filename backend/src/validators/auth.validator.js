import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string({ error: 'Valid email is required' }).trim().toLowerCase().email('Valid email is required'),
  password: z.string({ error: 'Password is required' }).min(1, 'Password is required'),
});
