import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { withLogger } from '../utils/withLogger.js';
import {
  orderItemValidate,
  orderItemUpdate,
} from '../validations/orderItem.validator.js';
import {OrderItemController} from '../controllers/orderItems.controller.js';

const router = Router();

router.get('/', authGuard,  roleGuard(['manager', 'admin', 'staff', 'customer']), withLogger(OrderItemController.getAll, `OrderItemController.getAll`));
router.get('/:id', authGuard, roleGuard(['manager', 'admin', 'staff', 'customer']), withLogger(OrderItemController.getOne, `OrderItemController.getOne`));
router.post('/', authGuard, roleGuard( ['manager', 'admin', 'customer']), validate(orderItemValidate), withLogger(OrderItemController.createOne, `OrderItemController.createOne`));
router.put('/:id', authGuard, roleGuard(['manager', 'admin', 'customer']), validate(orderItemUpdate), withLogger(OrderItemController.updateOne,`OrderItemController.updateOne`));
router.delete('/:id', authGuard, roleGuard(['manager', 'admin', 'customer']), withLogger(OrderItemController.deleteOne,`OrderItemController.deleteOne`));

export { router as orderItemRouter };
