import {Schema, model} from "mongoose"

const deliveryStaffSchema = new Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true},
    vehicle_number: {type: String, required: true},
    district_id: {type: Schema.Types.ObjectId, ref: "district", required: true}
}, {versionKey: false, timestamps: true})

const deliveryStaffModel = model("deliveryStaff", deliveryStaffSchema)

export default deliveryStaffModel