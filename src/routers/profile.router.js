import { Router } from 'express';
import {
  profileCustomer,
  profileStaff,
  refreshAccessCustomer,
  refreshAccessStaff,
} from '../controllers/auth.controller.js';
import { authGuard } from '../middleware/guard.middeware.js';

export const profileCustomerRouter = Router();
profileCustomerRouter.get('/', authGuard, profileCustomer);

export const profileStaffRouter = Router();
profileStaffRouter.get('/', authGuard, profileStaff);

export const refreshCustomerRouter = Router()
refreshCustomerRouter.post('/', refreshAccessCustomer );

export const refreshStaffRouter = Router()
refreshStaffRouter.post("/", refreshAccessStaff)
