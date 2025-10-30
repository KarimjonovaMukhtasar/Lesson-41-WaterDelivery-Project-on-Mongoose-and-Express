import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { withLogger } from '../utils/withLogger.js';
import {
  customerValidate,
  customerUpdate,
} from '../validations/customer.validator.js';
import { CustomerController} from '../controllers/customer.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard(['manager','admin']), withLogger(CustomerController.getAll, `CustomerController.getAll`));
router.get('/:id', authGuard, roleGuard(['manager','admin']), withLogger(CustomerController.getOne, `CustomerController.getOne`));
router.post('/',   roleGuard(['customer']), validate(customerValidate), withLogger(CustomerController.createOne, `CustomerController.createOne`));
router.put('/:id',  authGuard, roleGuard(['customer']), validate(customerUpdate), withLogger(CustomerController.updateOne, `CustomerController.updateOne`));
router.delete('/:id', authGuard, roleGuard(['manager','admin', 'customer']), withLogger(CustomerController.deleteOne, `CustomerController.deleteOne`));

export { router as customerRouter };
