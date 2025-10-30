import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import {
  customerValidate,
  customerUpdate,
} from '../validations/customer.validator.js';
import { CustomerController} from '../controllers/customer.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard(['manager','admin']), CustomerController.getAll);
router.get('/:id', authGuard, roleGuard(['manager','admin']), CustomerController.getOne);
router.post('/',   roleGuard(['customer']), validate(customerValidate), CustomerController.createOne);
router.put('/:id',  authGuard, roleGuard(['customer']), validate(customerUpdate), CustomerController.updateOne);
router.delete('/:id', authGuard, roleGuard(['manager','admin', 'customer']), CustomerController.deleteOne);

export { router as customerRouter };
