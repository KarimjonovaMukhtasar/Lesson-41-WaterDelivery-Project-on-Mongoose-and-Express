import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import {
  districtValidate,
  districtUpdate,
} from '../validations/district.validator.js';
import { DistrictController } from '../controllers/district.controller.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';


const router = Router();

router.get('/', authGuard, roleGuard(['manager', 'admin', 'staff', 'customer']), DistrictController.getAll);
router.get('/:id', authGuard, roleGuard(['manager', 'admin', 'staff', 'customer']), DistrictController.getOne);
router.post('/', authGuard, roleGuard(['customer']), validate(districtValidate), DistrictController.createOne);
router.put('/:id', authGuard, roleGuard(['manager', 'admin','customer']), validate(districtUpdate), DistrictController.updateOne);
router.delete('/:id',authGuard, roleGuard(['manager', 'admin', 'customer']), DistrictController.deleteOne);

export { router as districtRouter };
