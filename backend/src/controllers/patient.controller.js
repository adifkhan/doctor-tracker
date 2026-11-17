import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import * as patientService from '../services/patient.service.js';

export const list = asyncHandler(async (req, res) => {
  const { data, meta } = await patientService.listPatients(req.query);
  sendSuccess(res, data, { meta });
});

export const conditions = asyncHandler(async (req, res) => {
  sendSuccess(res, await patientService.getConditions());
});

export const update = asyncHandler(async (req, res) => {
  sendSuccess(res, await patientService.updatePatient(req.params.id, req.body));
});

export const remove = asyncHandler(async (req, res) => {
  sendSuccess(res, await patientService.deletePatient(req.params.id));
});
