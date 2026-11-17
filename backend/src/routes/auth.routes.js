import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/login', validate({ body: loginSchema }), controller.login);
router.get('/me', authenticate, controller.me);

export default router;
