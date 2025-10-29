import { Router } from 'express';
//LOGIN
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

//REGISTER
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

//PROFILE && REFRESH TOKENS
import {
  profileCustomer,
  profileStaff,
  refreshAccessCustomer,
  refreshAccessStaff,
} from '../controllers/auth.controller.js';
import { authGuard } from '../middleware/authGuard.js';

export const profileCustomerRouter = Router();
profileCustomerRouter.get('/', authGuard, profileCustomer);

export const profileStaffRouter = Router();
profileStaffRouter.get('/', authGuard, profileStaff);

export const refreshCustomerRouter = Router()
refreshCustomerRouter.post('/', refreshAccessCustomer );

export const refreshStaffRouter = Router()
refreshStaffRouter.post("/", refreshAccessStaff)