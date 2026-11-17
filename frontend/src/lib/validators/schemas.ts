import { z } from 'zod';
import { GENDERS } from '../constants';

const required = (label: string) => z.string().trim().min(1, `${label} is required`);
const email = z.string().trim().min(1, 'Email is required').email('Enter a valid email');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const doctorSchema = z.object({
  name: required('Name'),
  specialization: required('Specialization'),
  hospital: required('Hospital'),
  phone: required('Phone'),
  email,
});

export const patientSchema = z.object({
  name: required('Name'),
  age: z
    .string()
    .trim()
    .min(1, 'Age is required')
    .refine((v) => /^\d+$/.test(v) && Number(v) <= 150, 'Enter an age between 0 and 150'),
  gender: z.enum(GENDERS, { message: 'Select a gender' }),
  phone: required('Phone'),
  email: z.union([z.literal(''), email]),
  condition: required('Condition'),
});

export const patientFormSchema = patientSchema.extend({ doctor: z.string().optional() });

export type LoginValues = z.infer<typeof loginSchema>;
export type DoctorValues = z.infer<typeof doctorSchema>;
export type PatientValues = z.infer<typeof patientSchema>;
export type PatientFormValues = z.infer<typeof patientFormSchema>;
