import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard } from '../middleware/authGuard.js';
import { roleGuard} from '../middleware/roleGuard.js';
import { withLogger } from '../utils/withLogger.js';
import {
  addressValidate,
  addressUpdate,
} from '../validations/address.validator.js';
import { AddressController} from '../controllers/address.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard('manager','admin', 'customer'), withLogger(AddressController.getAll, `AddressController.getAll`));
router.get('/:id', authGuard, roleGuard('manager','admin', 'customer'), withLogger(AddressController.getOne, `AddressController.getOne`));
router.post('/', authGuard, roleGuard('manager','admin', 'customer'), validate(addressValidate), withLogger(AddressController.createOne, `AddressController.createOne`));
router.put('/:id', authGuard, roleGuard('customer'), validate(addressUpdate), withLogger(AddressController.updateOne, `AddressController.updateOne`));
router.delete('/:id',  authGuard, roleGuard('manager','admin', 'customer'),  withLogger(AddressController.deleteOne, `AddressController.deleteOne`));

export { router as addressRouter };
