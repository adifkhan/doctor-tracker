import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const AUTH_COOKIE = "dt_token";

const baseOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
  path: "/",
};

export const setAuthCookie = (res, token) => {
  const { exp } = jwt.decode(token);
  res.cookie(AUTH_COOKIE, token, {
    ...baseOptions,
    maxAge: exp * 1000 - Date.now(),
  });
};

export const clearAuthCookie = (res) =>
  res.clearCookie(AUTH_COOKIE, baseOptions);
