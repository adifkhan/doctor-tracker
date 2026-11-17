import type { User } from '@/types';
import type { LoginValues } from '@/lib/validators/schemas';
import { baseApi, unwrap } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{ user: User }, LoginValues>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: unwrap<{ user: User }>,
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    getMe: build.query<User, void>({
      query: () => '/auth/me',
      transformResponse: unwrap<User>,
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetMeQuery } = authApi;
