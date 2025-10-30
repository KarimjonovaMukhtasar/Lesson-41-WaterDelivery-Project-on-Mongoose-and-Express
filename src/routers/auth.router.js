import { Router } from 'express';
import { register } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validations.js';
import { loginValidate } from '../validations/auth.validator.js';
import {  login } from '../controllers/auth.controller.js';
import { withLogger } from '../utils/withLogger.js';
import { registerValidate } from '../validations/auth.validator.js';
import {  profile, refreshAccess } from '../controllers/auth.controller.js';
import { authGuard } from '../middleware/authGuard.js';

//LOGIN
export const loginRouter = Router();
loginRouter .post('/', validate(loginValidate), withLogger(login, `login`));

//REGISTER
export const registerRouter = Router();
registerRouter .post('/', validate(registerValidate), withLogger(register,`register`));

//PROFILE 
export const profileRouter = Router();
profileRouter.get('/', authGuard, withLogger(profile, `profile`));

//&& REFRESH TOKENS
export const refreshRouter = Router()
refreshRouter.post('/', withLogger(refreshAccess, `refreshAccess`));