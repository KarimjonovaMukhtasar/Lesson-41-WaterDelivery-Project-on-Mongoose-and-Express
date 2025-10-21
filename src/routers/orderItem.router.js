import {Router} from "express"
import { validate } from "../validations/validations.js"
import {orderItemValidate, orderItemUpdate} from "../validations/orderItem.validator.js"
import {getAll, getOne, updateOne, createOne, deleteOne} from "../controllers/orderItem.controller.js"

const router = Router()

router.get("/", getAll)
router.get("/:id", getOne)
router.post("/", validate(orderItemValidate), createOne)
router.put("/:id", validate(orderItemUpdate), updateOne)
router.delete("/:id", deleteOne)


export {router as orderItemRouter}