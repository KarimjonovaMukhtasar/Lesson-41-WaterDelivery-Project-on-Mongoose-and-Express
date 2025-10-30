import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import {
  deliveryStaffValidate,
  deliveryStaffUpdate,
} from '../validations/deliveryStaff.validator.js';
import {DeliveryStaffController} from '../controllers/deliveryStaff.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard(['manager','admin']), DeliveryStaffController.getAll);
router.get('/:id', authGuard , roleGuard(['manager','admin']), DeliveryStaffController.getOne);
router.post('/', roleGuard(['manager','admin']), validate(deliveryStaffValidate), DeliveryStaffController.createOne);
router.put('/:id', authGuard, roleGuard(['manager', 'admin']), validate(deliveryStaffUpdate), DeliveryStaffController.updateOne);
router.delete('/:id', authGuard,roleGuard(['manager','admin']), DeliveryStaffController.deleteOne);

export { router as deliveryStaffRouter };
