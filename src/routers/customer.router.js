import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { withLogger } from '../utils/withLogger.js';
import {
  customerUpdate,
} from '../validations/customer.validator.js';
import { CustomerController} from '../controllers/customer.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard('manager','admin', 'customer', 'staff'), withLogger(CustomerController.getAll, `CustomerController.getAll`));
router.get('/:id', authGuard, roleGuard('manager','admin', 'customer', 'staff'), withLogger(CustomerController.getOne, `CustomerController.getOne`));
// router.post('/',   validate(customerValidate), withLogger(CustomerController.createOne, `CustomerController.createOne`));
router.put('/:id',  authGuard, roleGuard('customer', 'admin'), validate(customerUpdate), withLogger(CustomerController.updateOne, `CustomerController.updateOne`));
router.delete('/:id', authGuard, roleGuard('manager','admin', 'customer'), withLogger(CustomerController.deleteOne, `CustomerController.deleteOne`));

export { router as customerRouter };
