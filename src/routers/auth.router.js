import { Router } from "express";
import { validate } from "../middleware/validations.js";
import {loginValidate, registerValidate } from "../validations/auth.validator.js"
import {loginCustomer, registerCustomer, profileCustomer, loginStaff, registerStaff, profileStaff, refreshAccessCustomer, refreshAccessStaff} from "../controllers/auth.controller.js"
import { authGuard } from "../middleware/authGuard.js";


export const authRouter = Router()

authRouter.post("/", validate(loginValidate), loginCustomer)
authRouter.post("/", validate(registerValidate), registerCustomer)
authRouter.get("/", authGuard, profileCustomer)
authRouter.post("/", refreshAccessCustomer)


export const staffRouter = Router()
staffRouter.post("/", validate(loginValidate), loginStaff)
staffRouter.post("/", validate(registerValidate), registerStaff)
staffRouter.get("/", authGuard, profileStaff)
staffRouter.post("/", refreshAccessStaff)