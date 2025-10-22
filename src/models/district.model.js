import { Schema, model } from 'mongoose';

const districtSchema = new Schema({
  name: { type: String, required: true },
});

const districtModel = model('district', districtSchema);

export default districtModel;
