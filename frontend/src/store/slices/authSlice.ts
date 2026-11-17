import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { clearAuthCookie, writeAuthCookie } from '@/lib/cookies';
import type { User } from '@/types';
import { authApi } from '../api/authApi';

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = { token: null, user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      clearAuthCookie();
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
        writeAuthCookie(payload.token);
      })
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, { payload }) => {
        state.user = payload;
      });
  },
});

export const { hydrateToken, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
