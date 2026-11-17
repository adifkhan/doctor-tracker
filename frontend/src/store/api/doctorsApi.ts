import type { Doctor, DoctorFilterOptions, Paginated, Patient } from '@/types';
import { baseApi, cleanParams, unwrap, unwrapPage } from './baseApi';

export interface DoctorListParams {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  hospital?: string;
  from?: string;
  to?: string;
}

export interface DoctorPatientsParams {
  page?: number;
  limit?: number;
  search?: string;
  condition?: string;
}

export interface NewDoctor {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

export interface NewPatient {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  condition: string;
}

const LIST = { type: 'Doctor' as const, id: 'LIST' };
const PATIENT_LIST = { type: 'Patient' as const, id: 'LIST' };

export const doctorsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDoctors: build.query<Paginated<Doctor>, DoctorListParams>({
      query: (params) => ({ url: '/doctors', params: cleanParams(params) }),
      transformResponse: unwrapPage<Doctor>,
      providesTags: (result) => [LIST, ...(result?.items ?? []).map(({ _id }) => ({ type: 'Doctor' as const, id: _id }))],
    }),
    getDoctorFilters: build.query<DoctorFilterOptions, void>({
      query: () => '/doctors/filters',
      transformResponse: unwrap<DoctorFilterOptions>,
      providesTags: ['DoctorFilters'],
    }),
    getDoctor: build.query<Doctor, string>({
      query: (id) => `/doctors/${id}`,
      transformResponse: unwrap<Doctor>,
      providesTags: (_r, _e, id) => [{ type: 'Doctor', id }],
    }),
    addDoctor: build.mutation<Doctor, NewDoctor>({
      query: (body) => ({ url: '/doctors', method: 'POST', body }),
      transformResponse: unwrap<Doctor>,
      invalidatesTags: [LIST, 'DoctorFilters', 'Dashboard'],
    }),
    getDoctorPatients: build.query<Paginated<Patient>, { id: string } & DoctorPatientsParams>({
      query: ({ id, ...params }) => ({ url: `/doctors/${id}/patients`, params: cleanParams(params) }),
      transformResponse: unwrapPage<Patient>,
      providesTags: (result) => [
        PATIENT_LIST,
        ...(result?.items ?? []).map(({ _id }) => ({ type: 'Patient' as const, id: _id })),
      ],
    }),
    addDoctorPatient: build.mutation<Patient, { doctorId: string; body: NewPatient }>({
      query: ({ doctorId, body }) => ({ url: `/doctors/${doctorId}/patients`, method: 'POST', body }),
      transformResponse: unwrap<Patient>,
      invalidatesTags: [PATIENT_LIST, 'Doctor', 'PatientConditions', 'Dashboard'],
    }),
    deleteDoctorPatient: build.mutation<{ id: string }, { doctorId: string; patientId: string }>({
      query: ({ doctorId, patientId }) => ({ url: `/doctors/${doctorId}/patients/${patientId}`, method: 'DELETE' }),
      transformResponse: unwrap<{ id: string }>,
      invalidatesTags: [PATIENT_LIST, 'Doctor', 'PatientConditions', 'Dashboard'],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorFiltersQuery,
  useGetDoctorQuery,
  useAddDoctorMutation,
  useGetDoctorPatientsQuery,
  useAddDoctorPatientMutation,
  useDeleteDoctorPatientMutation,
} = doctorsApi;
