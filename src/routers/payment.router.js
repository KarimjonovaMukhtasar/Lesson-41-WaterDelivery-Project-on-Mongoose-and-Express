import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { withLogger } from '../utils/withLogger.js';
import {
  paymentValidate
} from '../validations/payment.validator.js';
import { PaymentController } from '../controllers/payment.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard( 'manager', 'admin', 'customer'), withLogger(PaymentController.getAll, `PaymentController.getAll`));
router.get('/:id', authGuard, roleGuard('manager', 'admin', 'customer'), withLogger(PaymentController.getOne, `PaymentController.getOne`));
router.post('/', authGuard, roleGuard('customer'), validate(paymentValidate), withLogger(PaymentController.createOne,`PaymentController.createOne`));
// router.put('/:id', authGuard, roleGuard('customer'), validate(paymentUpdate), withLogger(PaymentController.updateOne, `PaymentController.updateOne`));
// router.delete('/:id', authGuard, roleGuard('manager', 'admin', 'customer'), withLogger(PaymentController.deleteOne,`PaymentController.deleteOne`));

export { router as paymentRouter };
