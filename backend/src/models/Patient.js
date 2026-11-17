import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0, max: 150 },
    gender: { type: String, required: true, enum: ["male", "female", "other"] },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    condition: { type: String, required: true, trim: true },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
  },
  { timestamps: true },
);

patientSchema.index({ doctor: 1, createdAt: -1 });
patientSchema.index({ condition: 1 });
patientSchema.index({ createdAt: -1 });
patientSchema.index({ phone: 1 });

export const Patient = mongoose.model("Patient", patientSchema);
