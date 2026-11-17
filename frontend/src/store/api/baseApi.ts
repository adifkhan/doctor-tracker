import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/lib/constants";
import type { ApiErrorBody, PageMeta } from "@/types";

export interface Envelope<T> {
  success: true;
  data: T;
  meta?: PageMeta;
}

export type ApiError = { status: number | string; data?: ApiErrorBody };

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extra) => {
  const result = await rawBaseQuery(args, api, extra);
  if (result.error?.status === 401 && api.endpoint !== "login") {
    await rawBaseQuery({ url: "/auth/logout", method: "POST" }, api, extra);
    const { clearSession } = await import("../slices/authSlice");
    api.dispatch(clearSession());
    if (typeof window !== "undefined") window.location.replace("/login");
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "Doctor",
    "Patient",
    "Dashboard",
    "DoctorFilters",
    "PatientConditions",
  ],
  endpoints: () => ({}),
});

export const unwrap = <T>(response: Envelope<T>) => response.data;

export const unwrapPage = <T>(
  response: Envelope<T[]>,
): { items: T[]; meta: PageMeta } => ({
  items: response.data,
  meta: response.meta ?? {
    page: 1,
    limit: response.data.length,
    total: response.data.length,
    totalPages: 1,
  },
});

export const cleanParams = <T extends object>(params: T) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== "" && v !== null,
    ),
  );
