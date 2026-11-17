import { ApiError } from "../utils/ApiError.js";
import { buildMeta, toSkipLimit } from "../utils/pagination.js";
import * as doctorRepository from "../repositories/doctor.repository.js";
import * as patientRepository from "../repositories/patient.repository.js";

export const listPatients = async (query) => {
  const { items, total } = await patientRepository.findPage(
    query,
    toSkipLimit(query),
  );
  return { data: items, meta: buildMeta(query, total) };
};

export const getConditions = () => patientRepository.distinctConditions();

export const updatePatient = async (id, payload) => {
  if (payload.doctor && !(await doctorRepository.existsById(payload.doctor))) {
    throw ApiError.notFound("Doctor not found");
  }
  const patient = await patientRepository.updateById(id, payload);
  if (!patient) throw ApiError.notFound("Patient not found");
  return patient;
};

export const deletePatient = async (id) => {
  const patient = await patientRepository.deleteById(id);
  if (!patient) throw ApiError.notFound("Patient not found");
  return { id };
};
