import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import * as authService from '../services/auth.service.js';

export const login = asyncHandler(async (req, res) => {
  sendSuccess(res, await authService.login(req.body));
});

export const me = (req, res) => sendSuccess(res, req.user);
