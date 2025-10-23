import { Router } from "express";
import { validate } from "../middleware/validations.js";
import {loginValidate, registerValidate } from "../validations/auth.validator.js"
import {loginCustomer, registerCustomer, profileCustomer, loginStaff, registerStaff, profileStaff} from "../controllers/auth.controller.js"

export const authRouter = Router()

authRouter.post("/",  validate(loginValidate), loginCustomer)
authRouter.post("/", validate(registerValidate), registerCustomer)
authRouter.get("/", profileCustomer)


export const staffRouter = Router()
staffRouter.post("/", validate(loginValidate), loginStaff)
staffRouter.post("/", validate(registerValidate), registerStaff)
staffRouter.get("/", profileStaff)