import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { withLogger } from '../utils/withLogger.js';
import {
  districtValidate,
  districtUpdate,
} from '../validations/district.validator.js';
import { DistrictController } from '../controllers/district.controller.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';


const router = Router();

router.get('/', authGuard, roleGuard('manager', 'admin', 'staff', 'customer'), withLogger(DistrictController.getAll, `DistrictController.getAll`));
router.get('/:id', authGuard, roleGuard('manager', 'admin', 'staff', 'customer'), withLogger(DistrictController.getOne,`DistrictController.getOne`));
router.post('/', authGuard, roleGuard('customer'), validate(districtValidate), withLogger(DistrictController.createOne, `DistrictController.createOne`));
router.put('/:id', authGuard, roleGuard('manager', 'admin','customer'), validate(districtUpdate), withLogger(DistrictController.updateOne, `DistrictController.updateOne`));
router.delete('/:id',authGuard, roleGuard('manager', 'admin', 'customer'), withLogger(DistrictController.deleteOne,`DistrictController.deleteOne`));

export { router as districtRouter };
