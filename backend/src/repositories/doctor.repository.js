import { Doctor } from "../models/Doctor.js";
import { compact, dateRangeFilter, searchFilter } from "../utils/query.js";

const buildFilter = ({ search, specialization, hospital, from, to }) =>
  compact([
    searchFilter(search, ["name", "phone", "email"]),
    specialization && { specialization },
    hospital && { hospital },
    dateRangeFilter(from, to),
  ]);

export const findPage = async (filters, { skip, limit }) => {
  const filter = buildFilter(filters);
  const [items, total] = await Promise.all([
    Doctor.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Doctor.countDocuments(filter),
  ]);
  return { items, total };
};

export const findById = (id) => Doctor.findById(id).lean();

export const existsById = (id) => Doctor.exists({ _id: id });

export const existsByEmail = (email) => Doctor.exists({ email });

export const create = async (data) => (await Doctor.create(data)).toObject();

export const distinctSpecializations = async () =>
  (await Doctor.distinct("specialization")).sort();

export const distinctHospitals = async () =>
  (await Doctor.distinct("hospital")).sort();

export const count = () => Doctor.countDocuments();

export const countByDay = (since) =>
  Doctor.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: "UTC",
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);
