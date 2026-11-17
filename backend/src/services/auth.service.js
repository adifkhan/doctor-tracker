import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import * as userRepository from '../repositories/user.repository.js';

const toProfile = (user) => ({ id: String(user._id), name: user.name, email: user.email, role: user.role });

export const login = async ({ email, password }) => {
  const user = await userRepository.findByEmailWithPassword(email);
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = jwt.sign({ sub: String(user._id), role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
  return { token, user: toProfile(user) };
};

export const getProfile = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) throw ApiError.unauthorized('User no longer exists');
  return toProfile(user);
};
