import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard, roleGuard } from '../middleware/guard.middeware.js';
import {
  orderItemValidate,
  orderItemUpdate,
} from '../validations/orderItem.validator.js';
import {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} from '../controllers/orderItems.controller.js';

const router = Router();

router.get('/', authGuard,  roleGuard('customer', 'manager', 'admin', 'staff'), getAll);
router.get('/:id', authGuard, roleGuard('customer', 'manager', 'admin', 'staff'), getOne);
router.post('/', authGuard, roleGuard('customer', 'manager', 'admin'), validate(orderItemValidate), createOne);
router.put('/:id', authGuard, roleGuard('customer', 'manager', 'admin'), validate(orderItemUpdate), updateOne);
router.delete('/:id', authGuard, roleGuard('customer', 'manager', 'admin'), deleteOne);

export { router as orderItemRouter };
