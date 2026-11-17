import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { AUTH_COOKIE } from "../utils/authCookie.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as authService from "../services/auth.service.js";

export const auth = (...roles) =>
  asyncHandler(async (req, res, next) => {
    const token = req.cookies?.[AUTH_COOKIE];
    if (!token) throw ApiError.unauthorized("Authentication required");

    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await authService.getProfile(payload.sub);

    if (roles.length && !roles.includes(user.role)) {
      throw ApiError.forbidden(
        "You do not have permission to perform this action",
      );
    }

    req.user = user;
    next();
  });
