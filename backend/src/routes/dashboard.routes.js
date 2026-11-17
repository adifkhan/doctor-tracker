import { Router } from "express";
import * as controller from "../controllers/dashboard.controller.js";
import { validate } from "../middlewares/validate.js";
import { statsQuery } from "../validators/dashboard.validator.js";

const router = Router();

router.get("/stats", validate({ query: statsQuery }), controller.stats);

export default router;
