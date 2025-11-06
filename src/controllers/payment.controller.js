import PaymentModel from '../models/payment.model.js';
import { ApiError } from '../helper/errorMessage.js';

export const PaymentController = {
  getAll: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const skip = (page - 1) * limit;
      const fields = Object.keys(PaymentModel.schema.paths).filter(
        (f) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(f) &&
          PaymentModel.schema.paths[f].instance === 'String' ,
      );
      const query = search
        ? {
            $or: fields.map((field) => ({
              [field]: { $regex: search, $options: 'i' },
            })),
          }
        : {};
      const [data, total] = await Promise.all([
        PaymentModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        PaymentModel.countDocuments(query),
      ]);
      return res.status(200).json({
        success: true,
        message: `RETRIEVED ALL DATA SUCCESSFULLY!`,
        data,
        limit,
        page,
      total,
        skip

      });
    } catch (error) {
      return next(error);
    }
  },

  getOne : async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await PaymentModel.findOne({ _id: id });
      if (!data) {
        return next(new ApiError(404,`NOT FOUND SUCH AN ID` ))
      }
      return res.status(200).json({
        success: true,
        message: `RETRIEVED ONE FROM DATA SUCCESSFULLY!`,
        data,
      });
    } catch (error) {
      return next(error);
    }
  },
   
  createOne : async (req, res, next) => {
    try {
      const body = req.validatedData;
      const data = await PaymentModel.create(body);
      data.customer_id = req.user._id
      await data.save()
      return res.status(201).json({
        success: true,
        message: `CREATED SUCCESSFULLY!`,
        data,
      });
    } catch (error) {
      return next(error);
    }
  },
  
  updateOne : async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.validatedData;
      const data = await PaymentModel.findByIdAndUpdate(id, body, { new: true });
      if (!data) {
        return next(new ApiError(404,`NOT FOUND SUCH AN ID` ))
      }
      return res.status(200).json({
        success: true,
        message: `UPDATED SUCCESSFULLY!`,
        data,
      });
    } catch (error) {
      return next(error);
    }
  },
  
  deleteOne : async(req, res, next) => {
    try {
      const { id } = req.params;
      const data = await PaymentModel.findByIdAndDelete({ _id: id });
      if (!data) {
        return next(new ApiError(404,`NOT FOUND SUCH AN ID` ))
      }
      return res.status(200).json({
        success: true,
        message: `DELETED SUCCESSFULLY!`,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }}


