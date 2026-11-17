import type { User } from '@/types';
import type { LoginValues } from '@/lib/validators/schemas';
import { baseApi, unwrap } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{ token: string; user: User }, LoginValues>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: unwrap<{ token: string; user: User }>,
    }),
    getMe: build.query<User, void>({
      query: () => '/auth/me',
      transformResponse: unwrap<User>,
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery } = authApi;
