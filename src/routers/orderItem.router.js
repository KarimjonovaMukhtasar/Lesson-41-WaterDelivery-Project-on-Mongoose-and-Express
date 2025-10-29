import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { selfGuard } from '../middleware/selfGuard.js';
import {
  orderItemValidate,
  orderItemUpdate,
} from '../validations/orderItem.validator.js';
import {OrderItemController} from '../controllers/orderItems.controller.js';

const router = Router();

router.get('/', authGuard,  roleGuard('manager', 'admin', 'staff', 'customer'), OrderItemController.getAll);
router.get('/:id', authGuard, roleGuard('manager', 'admin', 'staff', 'customer'), OrderItemController.getOne);
router.post('/', authGuard, roleGuard( 'manager', 'admin', 'customer',), validate(orderItemValidate), OrderItemController.createOne);
router.put('/:id', authGuard, selfGuard('manager', 'admin', 'customer'), validate(orderItemUpdate), OrderItemController.updateOne);
router.delete('/:id', authGuard, selfGuard('manager', 'admin', 'customer'), OrderItemController.deleteOne);

export { router as orderItemRouter };
