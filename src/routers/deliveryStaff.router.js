import { Router } from 'express';
import { validate } from '../validations/validations.js';
import {
  deliveryStaffValidate,
  deliveryStaffUpdate,
} from '../validations/deliveryStaff.validator.js';
import {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} from '../controllers/deliveryStaff.controller.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', validate(deliveryStaffValidate), createOne);
router.put('/:id', validate(deliveryStaffUpdate), updateOne);
router.delete('/:id', deleteOne);

export { router as deliveryStaffRouter };
