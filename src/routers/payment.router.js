import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import {
  paymentValidate,
  paymentUpdate,
} from '../validations/payment.validator.js';
import { PaymentController } from '../controllers/payment.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard( ['manager', 'admin', 'customer']), PaymentController.getAll);
router.get('/:id', authGuard, roleGuard(['manager', 'admin', 'customer']), PaymentController.getOne);
router.post('/', authGuard, roleGuard(['customer']), validate(paymentValidate), PaymentController.createOne);
router.put('/:id', authGuard, roleGuard(['customer']), validate(paymentUpdate), PaymentController.updateOne);
router.delete('/:id', authGuard, roleGuard(['manager', 'admin', 'customer']), PaymentController.deleteOne);

export { router as paymentRouter };
