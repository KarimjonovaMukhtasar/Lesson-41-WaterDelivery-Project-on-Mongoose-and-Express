import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: 'customer',
      required: true,
    },
    delivery_staff_id: {
      type: Schema.Types.ObjectId,
      ref: 'deliveryStaff',
      required: true,
    },
    order_date: { type: Date, default: Date.now() },
    status: {
      type: String,
      enum: ['ordered', 'cancelled', 'pending'],
      default: 'pending',
    },
  },
  {timestamps: true },
);

const OrderModel = model('order', orderSchema);

export default OrderModel;
