import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { orderValidate, orderUpdate } from '../validations/order.validator.js';
import {
  getAll,
  updateOne,
  createOne,
  deleteOne,
} from '../controllers/order.controller.js';

const router = Router();

router.get('/', getAll);
// router.get('/:id', getOne);
router.post('/', validate(orderValidate), createOne);
router.put('/:id', validate(orderUpdate), updateOne);
router.delete('/:id', deleteOne);

export { router as orderRouter };
