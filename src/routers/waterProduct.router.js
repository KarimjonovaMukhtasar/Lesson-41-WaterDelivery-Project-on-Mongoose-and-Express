import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { withLogger } from '../utils/withLogger.js';
import {
  waterProductValidate,
  waterProductUpdate,
} from '../validations/waterProduct.validator.js';
import {WaterProductController} from '../controllers/waterProduct.controller.js';

const router = Router();

router.get('/',   withLogger(WaterProductController.getAll, `WaterProductController.getAll`));
router.get('/:id',  withLogger(WaterProductController.getOne, `WaterProductController.getOne`));
router.post('/', authGuard, roleGuard('manager', 'admin'), validate(waterProductValidate), withLogger(WaterProductController.createOne, `WaterProductController.createOne`));
router.put('/:id', authGuard, roleGuard('manager', 'admin'), validate(waterProductUpdate), withLogger(WaterProductController.updateOne, `WaterProductController.updateOne`));
router.delete('/:id', authGuard, roleGuard('manager', 'admin'), withLogger(WaterProductController.deleteOne,`WaterProductController.deleteOne`));

export { router as waterProductRouter };
