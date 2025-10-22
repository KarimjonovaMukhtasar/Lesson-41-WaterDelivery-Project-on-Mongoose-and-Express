import { Router } from 'express';
import { validate } from '../validations/validations.js';
import {
  waterProductValidate,
  waterProductUpdate,
} from '../validations/waterProduct.validator.js';
import {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} from '../controllers/waterProduct.controller.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', validate(waterProductValidate), createOne);
router.put('/:id', validate(waterProductUpdate), updateOne);
router.delete('/:id', deleteOne);

export { router as waterProductRouter };
