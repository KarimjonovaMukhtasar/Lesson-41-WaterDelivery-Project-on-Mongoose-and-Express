import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { selfGuard } from '../middleware/selfGuard.js';

import {
  deliveryStaffValidate,
  deliveryStaffUpdate,
} from '../validations/deliveryStaff.validator.js';
import {DeliveryStaffController} from '../controllers/deliveryStaff.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard('manager','admin'), DeliveryStaffController.getAll);
router.get('/:id', authGuard , roleGuard('manager','admin', 'staff'), DeliveryStaffController.getOne);
router.post('/', roleGuard('staff', 'manager','admin'), validate(deliveryStaffValidate), DeliveryStaffController.createOne);
router.put('/:id', authGuard, selfGuard('manager', 'admin', 'staff'), validate(deliveryStaffUpdate), DeliveryStaffController.updateOne);
router.delete('/:id', authGuard, selfGuard('manager','admin', 'staff'), DeliveryStaffController.deleteOne);

export { router as deliveryStaffRouter };
