import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { selfGuard } from '../middleware/selfGuard.js';
import {
  waterProductValidate,
  waterProductUpdate,
} from '../validations/waterProduct.validator.js';
import {WaterProductController} from '../controllers/waterProducts.controller.js';

const router = Router();

router.get('/',  roleGuard('manager', 'admin', 'staff', 'customer'), WaterProductController.getAll);
router.get('/:id',  roleGuard('manager', 'admin', 'staff', 'customer'), WaterProductController.getOne);
router.post('/', authGuard, roleGuard('manager', 'admin'), validate(waterProductValidate), WaterProductController.createOne);
router.put('/:id', authGuard, selfGuard('manager', 'admin'), validate(waterProductUpdate), WaterProductController.updateOne);
router.delete('/:id', authGuard, selfGuard('manager', 'admin'), WaterProductController.deleteOne);

export { router as waterProductRouter };
