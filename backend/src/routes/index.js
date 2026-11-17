import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import authRoutes from "./auth.routes.js";
import doctorRoutes from "./doctor.routes.js";
import patientRoutes from "./patient.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import { ROLES as r } from "../utils/constants.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/doctors", auth(r.ADMIN), doctorRoutes);
router.use("/patients", auth(r.ADMIN), patientRoutes);
router.use("/dashboard", auth(r.ADMIN), dashboardRoutes);

export default router;
