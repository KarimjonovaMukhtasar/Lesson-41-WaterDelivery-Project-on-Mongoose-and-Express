import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard, roleGuard } from '../middleware/guard.middeware.js';
import {
  waterProductValidate,
  waterProductUpdate,
} from '../validations/waterProduct.validator.js';
import {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} from '../controllers/waterProducts.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard('customer', 'manager', 'admin', 'staff'), getAll);
router.get('/:id', authGuard, roleGuard('customer', 'manager', 'admin', 'staff'), getOne);
router.post('/', authGuard, roleGuard('manager', 'admin'), validate(waterProductValidate), createOne);
router.put('/:id', authGuard, roleGuard('manager', 'admin'), validate(waterProductUpdate), updateOne);
router.delete('/:id', authGuard, roleGuard('admin'), deleteOne);

export { router as waterProductRouter };
