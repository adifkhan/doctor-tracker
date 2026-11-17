import { Router } from "express";
import * as controller from "../controllers/doctor.controller.js";
import { validate } from "../middlewares/validate.js";
import { idParams } from "../validators/common.js";
import {
  createDoctorSchema,
  doctorPatientsQuery,
  listDoctorsQuery,
} from "../validators/doctor.validator.js";
import {
  createPatientSchema,
  doctorPatientParams,
} from "../validators/patient.validator.js";

const router = Router();

router.get("/", validate({ query: listDoctorsQuery }), controller.list);
router.get("/filters", controller.filters);
router.post("/", validate({ body: createDoctorSchema }), controller.create);
router.get("/:id", validate({ params: idParams }), controller.getById);
router.get(
  "/:id/patients",
  validate({ params: idParams, query: doctorPatientsQuery }),
  controller.listPatients,
);
router.post(
  "/:id/patients",
  validate({ params: idParams, body: createPatientSchema }),
  controller.addPatient,
);
router.delete(
  "/:id/patients/:patientId",
  validate({ params: doctorPatientParams }),
  controller.removePatient,
);

export default router;
