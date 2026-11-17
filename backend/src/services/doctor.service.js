import { ApiError } from "../utils/ApiError.js";
import { buildMeta, toSkipLimit } from "../utils/pagination.js";
import * as doctorRepository from "../repositories/doctor.repository.js";
import * as patientRepository from "../repositories/patient.repository.js";

export const listDoctors = async (query) => {
  const { items, total } = await doctorRepository.findPage(
    query,
    toSkipLimit(query),
  );
  const counts = await patientRepository.countByDoctorIds(
    items.map((d) => d._id),
  );
  const data = items.map((doctor) => ({
    ...doctor,
    patientCount: counts.get(String(doctor._id)) ?? 0,
  }));
  return { data, meta: buildMeta(query, total) };
};

export const getFilters = async () => {
  const [specializations, hospitals] = await Promise.all([
    doctorRepository.distinctSpecializations(),
    doctorRepository.distinctHospitals(),
  ]);
  return { specializations, hospitals };
};

export const createDoctor = async (payload) => {
  if (await doctorRepository.existsByEmail(payload.email)) {
    throw ApiError.conflict("A doctor with this email already exists");
  }
  return doctorRepository.create(payload);
};

export const getDoctor = async (id) => {
  const [doctor, patientCount] = await Promise.all([
    doctorRepository.findById(id),
    patientRepository.countByDoctor(id),
  ]);
  if (!doctor) throw ApiError.notFound("Doctor not found");
  return { ...doctor, patientCount };
};

const assertDoctorExists = async (id) => {
  if (!(await doctorRepository.existsById(id)))
    throw ApiError.notFound("Doctor not found");
};

export const listDoctorPatients = async (doctorId, query) => {
  await assertDoctorExists(doctorId);
  const { items, total } = await patientRepository.findPage(
    { ...query, doctor: doctorId },
    toSkipLimit(query),
  );
  return { data: items, meta: buildMeta(query, total) };
};

export const addPatient = async (doctorId, payload) => {
  await assertDoctorExists(doctorId);
  return patientRepository.create({ ...payload, doctor: doctorId });
};

export const removePatient = async (doctorId, patientId) => {
  const patient = await patientRepository.deleteByIdAndDoctor(
    patientId,
    doctorId,
  );
  if (!patient) throw ApiError.notFound("Patient not found for this doctor");
  return { id: patientId };
};
