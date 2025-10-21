import {Router} from "express"
import {validate} from "../validations/validations.js"
import addressRouter from "./address.router.js"
import customerRouter from "./customer.router.js"
import deliveryStaffRouter from "./deliveryStaff.router.js"
import districtRouter from "./district.router.js"
import orderRouter from "./order.router.js"
import orderItemRouter from "./orderItem.router.js"
import paymentRouter from  "./payment.router.js"
import waterProductRouter from "./waterProduct.router.js"

const MainRouter = Router()
MainRouter.use("/address", addressRouter)
MainRouter.use("/customer", customerRouter)
MainRouter.use("/delivery-staff", deliveryStaffRouter)
MainRouter.use("/district", districtRouter)
MainRouter.use("/order", orderRouter)
MainRouter.use("/order-item", orderItemRouter)
MainRouter.use("/payment", paymentRouter)
MainRouter.use("./water-product", waterProductRouter)