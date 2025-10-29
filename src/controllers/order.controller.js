import OrderModel from '../models/order.model.js';
import { orderMailer } from '../helper/nodeMailer.js';
import mongoose from 'mongoose';
import CustomerModel from '../models/customer.model.js';
import { ApiError } from '../helper/errorMessage.js';
import DeliveryStaffModel from '../models/deliveryStaff.model.js';
import WaterProductModel from '../models/waterProducts.model.js';
export const OrderController = {
  getAll: async (req, res, next) => {
    try {
      const model = OrderModel;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const skip = (page - 1) * limit;
      const fields = Object.keys(model.schema.paths).filter(
        (f) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(f),
      );
      const query = search
        ? {
            $or: fields.map((field) => ({
              [field]: { $regex: search, $options: 'i' },
            })),
          }
        : {};
      if (req.user.role === 'customer') {
        query.customer_id = req.user.id;
      }
      const [data, total] = await Promise.all([
        model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        model.countDocuments(query),
      ]);
      return res.status(200).json({
        success: true,
        message: `RETRIEVED ALL DATA SUCCESSFULLY!`,
        data,
        total,
        limit,
        page,
      });
    } catch (error) {
      return next(error);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const model = OrderModel;
      const { id } = req.params;
      const data = await model.findOne({
        _id: id,
        customer_id: req.user.customer_id,
      });
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

  createOne: async (req, res, next) => {
    const session = mongoose.startSession();
    try {
      await session.startTransaction();
      const { order, order_items } = req.validatedData;
      const customerId = await CustomerModel.findById({
        _id: order.customer_id,
      });
      if (!customerId) {
        return next(new ApiError(404, `NOT FOUND SUCH A CUSTOMER ID!`));
      }
      const deliveryStaffId = await DeliveryStaffModel.findById({
        _id: order.delivery_staff_id,
      });
      if (!deliveryStaffId) {
        return next(new ApiError(404, `NOT FOUND SUCH A DELIVERY STAFF ID!`));
      }
      const newOrder = await OrderModel.create([order], { session });
      const productId = await WaterProductModel.findById({
        _id: order_items.product_id,
      });
      if (!productId) {
        return next(new ApiError(404, `NOT FOUND SUCH A PRODUCT ID!`));
      }
      if (productId.quantity < order_items.quantity) {
        return next(new ApiError(404, `NOT ENOUGH PRODUCTS AS REQUIRED`));
      }
      productId.order_id = newOrder._id
      productId.quantity = productId.quantity - order_items.quantity;
      productId.total_price = parseInt(order_items.quantity) * productId.price;
      await productId.save();
      newOrder.status = `ordered`;
      await newOrder.save();
      await orderMailer(customerId.email, `ORDERED SUCCESSFULLY!`);
      await session.commitTransaction();
      await session.endSession();
      return res.status(201).json({
        success: true,
        message: `ORDER CREATED SUCCESSFULLY!`,
        order: newOrder[0],
        order_items: productId,
      });
    } catch (error) {
      await orderMailer(req.user.email, `ORDERED SUCCESSFULLY!`);
      await session.abortTransaction();
      await session.endSession();
      return next(error);
    }
  },

  updateOne: async (req, res, next) => {
    try {
      const model = OrderModel;
      const { id } = req.params;
      const body = req.validatedData;
      const data = await model.findByIdAndUpdate(id, body, { new: true });
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

  deleteOne: async (req, res, next) => {
    try {
      const model = OrderModel;
      const { id } = req.params;
      const data = await model.findByIdAndDelete({ _id: id });
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
  },
};
