import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { orderWithItemsValidate, orderWithItemsUpdate } from '../validations/order.validator.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';

import {OrderController} from '../controllers/order.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard(['manager', 'admin', 'staff','customer']), OrderController.getAll);
router.get('/:id', authGuard, roleGuard(['manager', 'admin', 'staff', 'customer']), OrderController.getOne);
router.post('/', authGuard, roleGuard(['customer']), validate(orderWithItemsValidate),  OrderController.createOne);
router.put('/:id', authGuard,  roleGuard(['customer']), validate(orderWithItemsUpdate), OrderController.updateOne);
router.delete('/:id', authGuard, roleGuard(['manager', 'admin', 'customer']), OrderController.deleteOne);

export { router as orderRouter };
