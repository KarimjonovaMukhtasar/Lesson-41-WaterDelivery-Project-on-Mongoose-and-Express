import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard, roleGuard } from '../middleware/guard.middeware.js';
import {
  customerValidate,
  customerUpdate,
} from '../validations/customer.validator.js';
import {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} from '../controllers/customer.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard('manager','admin', 'staff', 'customer'), getAll);
router.get('/:id', authGuard, roleGuard('manager','admin', 'staff', 'customer'), getOne);
router.post('/',  validate(customerValidate), roleGuard('customer'), createOne);
router.put('/:id',  authGuard, roleGuard('customer'), validate(customerUpdate), updateOne);
router.delete('/:id', authGuard, roleGuard('manager','admin', 'staff', 'customer'), deleteOne);

export { router as customerRouter };
