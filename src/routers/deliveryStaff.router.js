import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { withLogger } from '../utils/withLogger.js';
import {
  deliveryStaffValidate,
  deliveryStaffUpdate,
} from '../validations/deliveryStaff.validator.js';
import {DeliveryStaffController} from '../controllers/deliveryStaff.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard(['manager','admin']), withLogger(DeliveryStaffController.getAll, `DeliveryStaffController.getAll`));
router.get('/:id', authGuard , roleGuard(['manager','admin']), withLogger(DeliveryStaffController.getOne, `DeliveryStaffController.getOne`));
router.post('/', roleGuard(['manager','admin']), validate(deliveryStaffValidate), withLogger(DeliveryStaffController.createOne, `DeliveryStaffController.createOne`));
router.put('/:id', authGuard, roleGuard(['manager', 'admin']), validate(deliveryStaffUpdate), withLogger(DeliveryStaffController.updateOne, `DeliveryStaffController.updateOne`));
router.delete('/:id', authGuard,roleGuard(['manager','admin']), withLogger(DeliveryStaffController.deleteOne, `DeliveryStaffController.deleteOne`));

export { router as deliveryStaffRouter };
