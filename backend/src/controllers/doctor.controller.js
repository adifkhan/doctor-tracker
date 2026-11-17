import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import * as doctorService from '../services/doctor.service.js';

export const list = asyncHandler(async (req, res) => {
  const { data, meta } = await doctorService.listDoctors(req.query);
  sendSuccess(res, data, { meta });
});

export const filters = asyncHandler(async (req, res) => {
  sendSuccess(res, await doctorService.getFilters());
});

export const create = asyncHandler(async (req, res) => {
  sendSuccess(res, await doctorService.createDoctor(req.body), { status: 201 });
});

export const getById = asyncHandler(async (req, res) => {
  sendSuccess(res, await doctorService.getDoctor(req.params.id));
});

export const listPatients = asyncHandler(async (req, res) => {
  const { data, meta } = await doctorService.listDoctorPatients(req.params.id, req.query);
  sendSuccess(res, data, { meta });
});

export const addPatient = asyncHandler(async (req, res) => {
  sendSuccess(res, await doctorService.addPatient(req.params.id, req.body), { status: 201 });
});

export const removePatient = asyncHandler(async (req, res) => {
  const { id, patientId } = req.params;
  sendSuccess(res, await doctorService.removePatient(id, patientId));
});
