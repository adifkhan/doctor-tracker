import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { clearAuthCookie, setAuthCookie } from "../utils/authCookie.js";
import * as authService from "../services/auth.service.js";

export const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body);
  setAuthCookie(res, token);
  sendSuccess(res, { user });
});

export const logout = (req, res) => {
  clearAuthCookie(res);
  sendSuccess(res, { loggedOut: true });
};

export const me = (req, res) => sendSuccess(res, req.user);
