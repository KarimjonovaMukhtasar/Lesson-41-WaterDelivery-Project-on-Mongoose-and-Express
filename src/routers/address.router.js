import { Router } from 'express';
import { validate } from '../validations/validations.js';
import {
  addressValidate,
  addressUpdate,
} from '../validations/address.validator.js';
import {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} from '../controllers/address.controller.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', validate(addressValidate), createOne);
router.put('/:id', validate(addressUpdate), updateOne);
router.delete('/:id', deleteOne);

export { router as addressRouter };
