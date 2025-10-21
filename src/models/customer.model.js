import { Schema, model } from "mongoose"

const customerSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true }
}, { versionKey: false, timestamps: true })
const CustomerModel = model("customer", customerSchema)

export default CustomerModel;