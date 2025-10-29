import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { boolean } from 'zod';

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {type: String,  enum: ['customer'],  default: 'customer'},
    isActive: {type: boolean,  default: false}
  },
  { timestamps: true },
);

customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

customerSchema.pre('findByIdAndUpdate', async function (next) {
  if (!this.isModified('password')) return next();
  const update = this.getUpdate();
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  next();
});

customerSchema.methods.comparePassword = async function (customerPassword) {
  const isValidPassword = await bcrypt.compare(customerPassword, this.password);
  return isValidPassword;
};

const CustomerModel = model('customer', customerSchema);

export default CustomerModel;
