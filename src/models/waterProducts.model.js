import { Schema, model } from 'mongoose';

const WaterProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: {type: Number, required:true},
    volume_liters: { type: String, required: true },
      customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'customer'
      }
  },
  { timestamps: true },
);

const WaterProductModel = model('waterProduct', WaterProductSchema);

export default WaterProductModel;
