import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { orderValidate, orderUpdate } from '../validations/order.validator.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { selfGuard } from '../middleware/selfGuard.js';
import {OrderController} from '../controllers/order.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard('manager', 'admin', 'staff','customer'), OrderController.getAll);
router.get('/:id', authGuard, roleGuard('manager', 'admin', 'staff', 'customer'), OrderController.getOne);
router.post('/', authGuard, roleGuard('customer'), validate(orderValidate),  OrderController.createOne);
router.put('/:id', authGuard,  selfGuard('manager', 'admin', 'customer'), validate(orderUpdate), OrderController.updateOne);
router.delete('/:id', authGuard, selfGuard('manager', 'admin', 'customer'), OrderController.deleteOne);

export { router as orderRouter };
