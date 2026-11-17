import { Router } from "express";
import * as controller from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/login", validate({ body: loginSchema }), controller.login);
router.post("/logout", controller.logout);
router.get("/me", auth(), controller.me);

export default router;
