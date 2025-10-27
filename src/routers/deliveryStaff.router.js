import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard, roleGuard } from '../middleware/guard.middeware.js';
import {
  deliveryStaffValidate,
  deliveryStaffUpdate,
} from '../validations/deliveryStaff.validator.js';
import {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} from '../controllers/deliveryStaff.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard('manager','admin'), getAll);
router.get('/:id', authGuard , roleGuard('manager','admin', 'staff'), getOne);
router.post('/', roleGuard('staff', 'manager','admin'), validate(deliveryStaffValidate), createOne);
router.put('/:id', authGuard, roleGuard('manager', 'admin', 'staff'), validate(deliveryStaffUpdate), updateOne);
router.delete('/:id', authGuard, roleGuard('manager','admin', 'staff'), deleteOne);

export { router as deliveryStaffRouter };
