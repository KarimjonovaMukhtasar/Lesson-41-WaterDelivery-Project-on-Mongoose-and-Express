import { Router } from 'express';
import { register } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validations.js';
import { loginValidate } from '../validations/auth.validator.js';
import {  login } from '../controllers/auth.controller.js';
import { registerValidate } from '../validations/auth.validator.js';
import {  profile, refreshAccess } from '../controllers/auth.controller.js';
import { authGuard } from '../middleware/authGuard.js';

//LOGIN
export const loginRouter = Router();
loginRouter .post('/', validate(loginValidate), login);

//REGISTER
export const registerRouter = Router();
registerRouter .post('/', validate(registerValidate), register);

//PROFILE 
export const profileRouter = Router();
profileRouter.get('/', authGuard, profile);

//&& REFRESH TOKENS
export const refreshRouter = Router()
refreshRouter.post('/', refreshAccess);