import { Router } from 'express';
import { validate } from '../validations/validations.js';
import {
  paymentValidate,
  paymentUpdate,
} from '../validations/payment.validator.js';
import {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} from '../controllers/payment.controller.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', validate(paymentValidate), createOne);
router.put('/:id', validate(paymentUpdate), updateOne);
router.delete('/:id', deleteOne);

export { router as paymentRouter };
