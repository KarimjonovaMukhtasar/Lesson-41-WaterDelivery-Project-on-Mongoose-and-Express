import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard, roleGuard } from '../middleware/guard.middeware.js';
import {
  paymentValidate,
  paymentUpdate,
} from '../validations/payment.validator.js';
import {
  getAll,
  updateOne,
  getOne,
  createOne,
  deleteOne,
} from '../controllers/payment.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard('customer', 'manager', 'admin'), getAll);
router.get('/:id', authGuard, roleGuard('customer', 'manager', 'admin'), getOne);
router.post('/', authGuard, roleGuard('customer'), validate(paymentValidate), createOne);
router.put('/:id', authGuard, roleGuard('customer'), validate(paymentUpdate), updateOne);
router.delete('/:id', authGuard, roleGuard('customer', 'manager', 'admin'), deleteOne);

export { router as paymentRouter };
