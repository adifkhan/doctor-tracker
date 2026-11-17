import { z } from 'zod';
import {
  dateRangeError,
  dateRangeQuery,
  objectId,
  optional,
  paginationQuery,
  validDateRange,
} from './common.js';

const text = (label) => z.string({ error: `${label} is required` }).trim().min(1, `${label} is required`);

const patientFields = {
  name: text('Name'),
  age: z.coerce.number({ error: 'Age must be a number' }).int().min(0).max(150),
  gender: z.enum(['male', 'female', 'other'], { message: 'Gender must be male, female or other' }),
  phone: text('Phone'),
  email: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().trim().toLowerCase().email('Valid email is required').optional()
  ),
  condition: text('Condition'),
};

export const createPatientSchema = z.object(patientFields);

export const updatePatientSchema = z
  .object({ ...patientFields, doctor: objectId })
  .partial()
  .refine((body) => Object.keys(body).length > 0, { message: 'At least one field is required' });

export const listPatientsQuery = z
  .object({
    ...paginationQuery,
    ...dateRangeQuery,
    condition: optional(z.string().trim()),
    doctor: optional(objectId),
    gender: optional(z.enum(['male', 'female', 'other'])),
  })
  .refine(validDateRange, dateRangeError);

export const doctorPatientParams = z.object({ id: objectId, patientId: objectId });
