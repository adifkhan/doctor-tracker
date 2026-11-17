import type { Gender, Paginated, Patient } from '@/types';
import { baseApi, cleanParams, unwrap, unwrapPage } from './baseApi';

export interface PatientListParams {
  page?: number;
  limit?: number;
  search?: string;
  condition?: string;
  doctor?: string;
  gender?: Gender | '';
  from?: string;
  to?: string;
}

export interface PatientUpdate {
  name?: string;
  age?: number;
  gender?: Gender;
  phone?: string;
  email?: string;
  condition?: string;
  doctor?: string;
}

const LIST = { type: 'Patient' as const, id: 'LIST' };

export const patientsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPatients: build.query<Paginated<Patient>, PatientListParams>({
      query: (params) => ({ url: '/patients', params: cleanParams(params) }),
      transformResponse: unwrapPage<Patient>,
      providesTags: (result) => [LIST, ...(result?.items ?? []).map(({ _id }) => ({ type: 'Patient' as const, id: _id }))],
    }),
    getConditions: build.query<string[], void>({
      query: () => '/patients/conditions',
      transformResponse: unwrap<string[]>,
      providesTags: ['PatientConditions'],
    }),
    updatePatient: build.mutation<Patient, { id: string; body: PatientUpdate }>({
      query: ({ id, body }) => ({ url: `/patients/${id}`, method: 'PATCH', body }),
      transformResponse: unwrap<Patient>,
      invalidatesTags: [LIST, 'Doctor', 'PatientConditions', 'Dashboard'],
    }),
    deletePatient: build.mutation<{ id: string }, string>({
      query: (id) => ({ url: `/patients/${id}`, method: 'DELETE' }),
      transformResponse: unwrap<{ id: string }>,
      invalidatesTags: [LIST, 'Doctor', 'PatientConditions', 'Dashboard'],
    }),
  }),
});

export const { useGetPatientsQuery, useGetConditionsQuery, useUpdatePatientMutation, useDeletePatientMutation } =
  patientsApi;
