import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import {
  districtValidate,
  districtUpdate,
} from '../validations/district.validator.js';
import {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} from '../controllers/district.controller.js';
import { authGuard, roleGuard } from '../middleware/guard.middeware.js';

const router = Router();

router.get('/', authGuard, roleGuard('manager', 'admin', 'staff', 'customer'), getAll);
router.get('/:id', authGuard, roleGuard('staff','manager', 'admin', 'customer'), getOne);
router.post('/', authGuard, roleGuard('manager', 'admin'), validate(districtValidate), createOne);
router.put('/:id', authGuard, roleGuard('manager', 'admin'), validate(districtUpdate), updateOne);
router.delete('/:id',authGuard, roleGuard('manager', 'admin'), deleteOne);

export { router as districtRouter };
