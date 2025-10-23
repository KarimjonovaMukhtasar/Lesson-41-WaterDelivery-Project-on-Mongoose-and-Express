import { Schema, model } from 'mongoose';
import bcrypt from "bcrypt"

const deliveryStaffSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    vehicle_number: { type: String, required: true },
    district_id: {
      type: Schema.Types.ObjectId,
      ref: 'district',
      required: true,
    },
    email: {type: String, required:true},
    password: {type: String, required: true}
  },
  { versionKey: false, timestamps: true },
);

deliveryStaffSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

deliveryStaffSchema.pre('findByIdAndUpdate', async function(next) {
    const update = this.getUpdate();
    if (update.password) {
        update.password = await bcrypt.hash(update.password, 10);
    }
    next();
});
const DeliveryStaffModel = model('deliveryStaff', deliveryStaffSchema);

export default DeliveryStaffModel;
