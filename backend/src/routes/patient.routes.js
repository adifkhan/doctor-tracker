import { Router } from 'express';
import * as controller from '../controllers/patient.controller.js';
import { validate } from '../middlewares/validate.js';
import { idParams } from '../validators/common.js';
import { listPatientsQuery, updatePatientSchema } from '../validators/patient.validator.js';

const router = Router();

router.get('/', validate({ query: listPatientsQuery }), controller.list);
router.get('/conditions', controller.conditions);
router.patch('/:id', validate({ params: idParams, body: updatePatientSchema }), controller.update);
router.delete('/:id', validate({ params: idParams }), controller.remove);

export default router;
