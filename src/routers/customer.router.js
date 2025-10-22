import { Router } from 'express';
import { validate } from '../validations/validations.js';
import {
  customerValidate,
  customerUpdate,
} from '../validations/customer.validator.js';
import {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} from '../controllers/customer.controller.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', validate(customerValidate), createOne);
router.put('/:id', validate(customerUpdate), updateOne);
router.delete('/:id', deleteOne);

export { router as customerRouter };
