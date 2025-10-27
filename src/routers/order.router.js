import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { orderValidate, orderUpdate } from '../validations/order.validator.js';
import { authGuard, roleGuard } from '../middleware/guard.middeware.js';
import {
  getAll,
  updateOne,
  createOne,
  deleteOne,
  getOne
} from '../controllers/order.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard('staff','manager', 'admin', 'customer'), getAll);
router.get('/:id', authGuard, roleGuard('staff','manager', 'admin', 'customer'), getOne);
router.post('/', authGuard, roleGuard('customer'), validate(orderValidate),  createOne);
router.put('/:id', authGuard,  roleGuard('customer'), validate(orderUpdate),  updateOne);
router.delete('/:id', authGuard, roleGuard('customer'), deleteOne);

export { router as orderRouter };
