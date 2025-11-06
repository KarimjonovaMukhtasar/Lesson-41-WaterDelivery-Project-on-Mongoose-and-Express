import { Schema, model } from 'mongoose';

const districtSchema = new Schema({
  name: { type: String, required: true },
  customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'customer'
      }
},{timestamps: true });

const DistrictModel = model('district', districtSchema);

export default DistrictModel;
