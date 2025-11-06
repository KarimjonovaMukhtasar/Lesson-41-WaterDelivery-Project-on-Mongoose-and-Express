import { Schema, model } from 'mongoose';

const PaymentSchema = new Schema(
  {
    order_id: { type: Schema.Types.ObjectId, ref: 'order', required: true },
      customer_id: {
            type: Schema.Types.ObjectId,
            ref: 'customer'
          },
    amount: { type: Number, required: true },
    payment_date: { type: Date, default: Date.now() },
    method: {
      type: String,
      enum: ['cash', 'credit', 'online'],
      required: true
    },
  },
  {timestamps: true },
);

const PaymentModel = model('payment', PaymentSchema);

export default PaymentModel;
