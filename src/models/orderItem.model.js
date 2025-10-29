import { Schema, model } from 'mongoose';

const OrderItemSchema = new Schema(
  {
    order_id: { type: Schema.Types.ObjectId, ref: 'order', required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'product', required: true },
    quantity: { type: Number, required: true },
    total_price: { type: Number, default: 0.01 },
  },
  { timestamps: true },
);

const OrderItemModel = model('orderItem', OrderItemSchema);

export default OrderItemModel;
