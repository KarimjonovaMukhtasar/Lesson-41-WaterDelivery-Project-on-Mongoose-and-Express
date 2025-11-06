import { Schema, model } from 'mongoose';

const OrderItemSchema = new Schema(
  {
    order_id: { type: Schema.Types.ObjectId, ref: 'order', required: true },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'waterProduct',
      required: true,
    },
    quantity: { type: Number, required: true },
    total_price: { type: Number, default: 0.01 },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: 'customer'
    },
  },
  { timestamps: true },
);

export const OrderItemModel = model('orderItem', OrderItemSchema);