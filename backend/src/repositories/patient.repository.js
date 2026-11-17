import { Patient } from '../models/Patient.js';
import { compact, dateRangeFilter, searchFilter } from '../utils/query.js';

const DOCTOR_FIELDS = 'name specialization';

const buildFilter = ({ search, condition, doctor, gender, from, to }) =>
  compact([
    searchFilter(search, ['name', 'phone', 'email']),
    condition && { condition },
    doctor && { doctor },
    gender && { gender },
    dateRangeFilter(from, to),
  ]);

export const findPage = async (filters, { skip, limit }) => {
  const filter = buildFilter(filters);
  const [items, total] = await Promise.all([
    Patient.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .populate('doctor', DOCTOR_FIELDS)
      .lean(),
    Patient.countDocuments(filter),
  ]);
  return { items, total };
};

export const create = async (data) => (await Patient.create(data)).toObject();

export const updateById = (id, data) =>
  Patient.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('doctor', DOCTOR_FIELDS)
    .lean();

export const deleteById = (id) => Patient.findByIdAndDelete(id).lean();

export const deleteByIdAndDoctor = (id, doctor) => Patient.findOneAndDelete({ _id: id, doctor }).lean();

export const distinctConditions = async () => (await Patient.distinct('condition')).sort();

export const count = () => Patient.countDocuments();

export const countByDoctorIds = async (doctorIds) => {
  const rows = await Patient.aggregate([
    { $match: { doctor: { $in: doctorIds } } },
    { $group: { _id: '$doctor', count: { $sum: 1 } } },
  ]);
  return new Map(rows.map((row) => [String(row._id), row.count]));
};

export const countByDoctor = (doctorId) => Patient.countDocuments({ doctor: doctorId });

export const topDoctors = (limit) =>
  Patient.aggregate([
    { $group: { _id: '$doctor', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: limit },
    { $lookup: { from: 'doctors', localField: '_id', foreignField: '_id', as: 'doctor' } },
    { $unwind: '$doctor' },
    { $project: { _id: 0, doctorId: '$_id', name: '$doctor.name', count: 1 } },
  ]);

export const countByDay = (since) =>
  Patient.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'UTC' } }, count: { $sum: 1 } } },
  ]);

export const topConditions = (limit) =>
  Patient.aggregate([
    { $group: { _id: '$condition', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: limit },
    { $project: { _id: 0, condition: '$_id', count: 1 } },
  ]);
