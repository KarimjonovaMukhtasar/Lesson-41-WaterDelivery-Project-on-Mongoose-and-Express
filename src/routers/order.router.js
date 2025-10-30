import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { orderWithItemsValidate, orderWithItemsUpdate } from '../validations/order.validator.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { withLogger } from '../utils/withLogger.js';

import {OrderController} from '../controllers/order.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard(['manager', 'admin', 'staff','customer']), withLogger(OrderController.getAll, `OrderController.getAll`));
router.get('/:id', authGuard, roleGuard(['manager', 'admin', 'staff', 'customer']), withLogger(OrderController.getOne, `OrderController.getOne`));
router.post('/', authGuard, roleGuard(['customer']), validate(orderWithItemsValidate),  withLogger(OrderController.createOne, `OrderController.createOne`));
router.put('/:id', authGuard,  roleGuard(['customer']), validate(orderWithItemsUpdate), withLogger(OrderController.updateOne, `OrderController.updateOne`));
router.delete('/:id', authGuard, roleGuard(['manager', 'admin', 'customer']), withLogger(OrderController.deleteOne, `OrderController.deleteOne`));

export { router as orderRouter };
