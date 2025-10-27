import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard, roleGuard } from '../middleware/guard.middeware.js';
import {
  addressValidate,
  addressUpdate,
} from '../validations/address.validator.js';
import {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} from '../controllers/address.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard('manager','admin', 'staff', 'customer'), getAll);
router.get('/:id', authGuard, roleGuard('manager','admin', 'staff', 'customer'), getOne);
router.post('/', authGuard, roleGuard('manager','admin'), validate(addressValidate), createOne);
router.put('/:id', authGuard, roleGuard('manager','admin'), validate(addressUpdate), updateOne);
router.delete('/:id',  authGuard, roleGuard('manager','admin'),  deleteOne);

export { router as addressRouter };
