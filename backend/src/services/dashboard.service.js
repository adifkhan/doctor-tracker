import * as doctorRepository from "../repositories/doctor.repository.js";
import * as patientRepository from "../repositories/patient.repository.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const TOP_DOCTORS = 8;
const TOP_CONDITIONS = 6;

const isoDay = (date) => date.toISOString().slice(0, 10);

const startOfPeriod = (days) => {
  const today = new Date();
  const midnight = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  return new Date(midnight - (days - 1) * DAY_MS);
};

const zeroFill = (rows, start, days) => {
  const counts = new Map(rows.map((row) => [row._id, row.count]));
  return Array.from({ length: days }, (_, i) => {
    const date = isoDay(new Date(start.getTime() + i * DAY_MS));
    return { date, count: counts.get(date) ?? 0 };
  });
};

export const getStats = async (days) => {
  const start = startOfPeriod(days);

  const [
    doctors,
    patients,
    patientsPerDoctor,
    patientDays,
    doctorDays,
    topConditions,
  ] = await Promise.all([
    doctorRepository.count(),
    patientRepository.count(),
    patientRepository.topDoctors(TOP_DOCTORS),
    patientRepository.countByDay(start),
    doctorRepository.countByDay(start),
    patientRepository.topConditions(TOP_CONDITIONS),
  ]);

  const conditionBreakdown = [...topConditions];
  const other = patients - topConditions.reduce((sum, c) => sum + c.count, 0);
  if (other > 0) conditionBreakdown.push({ condition: "Other", count: other });

  return {
    totals: { doctors, patients },
    patientsPerDoctor,
    patientsOverTime: zeroFill(patientDays, start, days),
    doctorsOverTime: zeroFill(doctorDays, start, days),
    conditionBreakdown,
  };
};
