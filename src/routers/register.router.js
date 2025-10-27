import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import {
  validateStaff,
  validateCustomer
} from '../validations/auth.validator.js';

import {
  registerCustomer,
  registerStaff
} from '../controllers/auth.controller.js';

export const registerCustomerRouter = Router();
registerCustomerRouter .post('/', validate(validateCustomer), registerCustomer);

export const registerStaffRouter = Router();
registerStaffRouter.post('/', validate(validateStaff), registerStaff);

