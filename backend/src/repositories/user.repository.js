import { User } from "../models/User.js";

export const findByEmailWithPassword = (email) =>
  User.findOne({ email }).select("+password");

export const findById = (id) => User.findById(id).lean();

export const existsByEmail = (email) => User.exists({ email });

export const create = (data) => User.create(data);
