import type { DashboardStats, StatsRange } from '@/types';
import { baseApi, unwrap } from './baseApi';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStats: build.query<DashboardStats, StatsRange>({
      query: (days) => ({ url: '/dashboard/stats', params: { days } }),
      transformResponse: unwrap<DashboardStats>,
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetStatsQuery } = dashboardApi;
