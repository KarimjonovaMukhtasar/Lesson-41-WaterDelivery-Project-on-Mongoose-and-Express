import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard } from '../middleware/authGuard.js';
import { roleGuard} from '../middleware/roleGuard.js';
import { selfGuard } from '../middleware/selfGuard.js';
import {
  addressValidate,
  addressUpdate,
} from '../validations/address.validator.js';
import { AddressController} from '../controllers/address.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard(['manager','admin', 'staff', 'customer']), AddressController.getAll);
router.get('/:id', authGuard, roleGuard(['manager','admin', 'staff', 'customer']), AddressController.getOne);
router.post('/', authGuard, roleGuard(['customer']), validate(addressValidate), AddressController.createOne);
router.put('/:id', authGuard, selfGuard(['manager','admin', 'customer']), validate(addressUpdate), AddressController.updateOne);
router.delete('/:id',  authGuard, selfGuard(['manager','admin', 'customer']),  AddressController.deleteOne);

export { router as addressRouter };
