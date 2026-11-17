export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: string;
  patientCount: number;
}

export interface DoctorRef {
  _id: string;
  name: string;
  specialization: string;
}

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  email?: string;
  condition: string;
  doctor: DoctorRef;
  createdAt: string;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PageMeta;
}

export interface DoctorFilterOptions {
  specializations: string[];
  hospitals: string[];
}

export interface DashboardStats {
  totals: { doctors: number; patients: number };
  patientsPerDoctor: { doctorId: string; name: string; count: number }[];
  patientsOverTime: { date: string; count: number }[];
  doctorsOverTime: { date: string; count: number }[];
  conditionBreakdown: { condition: string; count: number }[];
}

export type StatsRange = 7 | 30 | 90;

export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
}
