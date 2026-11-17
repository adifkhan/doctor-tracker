import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import * as dashboardService from '../services/dashboard.service.js';

export const stats = asyncHandler(async (req, res) => {
  sendSuccess(res, await dashboardService.getStats(req.query.days));
});
