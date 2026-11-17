import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import authRoutes from './auth.routes.js';
import doctorRoutes from './doctor.routes.js';
import patientRoutes from './patient.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/doctors', authenticate, doctorRoutes);
router.use('/patients', authenticate, patientRoutes);
router.use('/dashboard', authenticate, dashboardRoutes);

export default router;
