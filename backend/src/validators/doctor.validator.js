import { z } from 'zod';
import { dateRangeError, dateRangeQuery, optional, paginationQuery, validDateRange } from './common.js';

const text = (label) => z.string({ error: `${label} is required` }).trim().min(1, `${label} is required`);

export const createDoctorSchema = z.object({
  name: text('Name'),
  specialization: text('Specialization'),
  hospital: text('Hospital'),
  phone: text('Phone'),
  email: z.string({ error: 'Valid email is required' }).trim().toLowerCase().email('Valid email is required'),
});

export const listDoctorsQuery = z
  .object({
    ...paginationQuery,
    ...dateRangeQuery,
    specialization: optional(z.string().trim()),
    hospital: optional(z.string().trim()),
  })
  .refine(validDateRange, dateRangeError);

export const doctorPatientsQuery = z.object({
  ...paginationQuery,
  condition: optional(z.string().trim()),
});
