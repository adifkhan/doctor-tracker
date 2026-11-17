import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

const normalize = (err) => {
  if (err instanceof ApiError) {
    return { status: err.statusCode, message: err.message, errors: err.errors };
  }
  if (err instanceof ZodError) {
    const errors = err.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }));
    return { status: 400, message: "Validation failed", errors };
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return { status: 400, message: "Validation failed", errors };
  }
  if (err instanceof mongoose.Error.CastError) {
    return { status: 400, message: `Invalid ${err.path}: ${err.value}` };
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return {
      status: 409,
      message: `Duplicate value for ${field}`,
      errors: [{ field, message: "Already exists" }],
    };
  }
  if (err instanceof jwt.TokenExpiredError) {
    return { status: 401, message: "Token expired" };
  }
  if (err instanceof jwt.JsonWebTokenError) {
    return { status: 401, message: "Invalid token" };
  }
  if (err.type === "entity.parse.failed") {
    return { status: 400, message: "Malformed JSON body" };
  }
  return null;
};

export const errorHandler = (err, req, res, next) => {
  const known = normalize(err);

  if (!known) {
    console.error(err);
    const body = { success: false, message: "Internal server error" };
    if (env.NODE_ENV !== "production") body.stack = err.stack;
    return res.status(500).json(body);
  }

  const body = { success: false, message: known.message };
  if (known.errors) body.errors = known.errors;
  return res.status(known.status).json(body);
};
