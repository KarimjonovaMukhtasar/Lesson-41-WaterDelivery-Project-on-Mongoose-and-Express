import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import {
  loginValidate
} from '../validations/auth.validator.js';

import {
  loginCustomer,
  loginStaff
} from '../controllers/auth.controller.js';

export const loginCustomerRouter = Router();
loginCustomerRouter .post('/', validate(loginValidate), loginCustomer);

export const loginStaffRouter = Router();
loginStaffRouter.post('/', validate(loginValidate), loginStaff);
