import { Router } from 'express';
import { validate } from '../validations/validations.js';
import {
  districtValidate,
  districtUpdate,
} from '../validations/district.validator.js';
import {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} from '../controllers/district.controller.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', validate(districtValidate), createOne);
router.put('/:id', validate(districtUpdate), updateOne);
router.delete('/:id', deleteOne);

export { router as districtRouter };
