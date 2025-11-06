import OrderModel from '../models/order.model.js';
import { orderMailer } from '../helper/nodeMailer.js';
import mongoose from 'mongoose';
import CustomerModel from '../models/customer.model.js';
import { ApiError } from '../helper/errorMessage.js';
import DeliveryStaffModel from '../models/deliveryStaff.model.js';
import WaterProductModel from '../models/waterProducts.model.js';
import { OrderItemModel } from '../models/orderItem.model.js'

export const OrderController = {
  getAll: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const skip = (page - 1) * limit;
      const fields = Object.keys(OrderModel.schema.paths).filter(
        (f) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(f)  &&
          OrderModel.schema.paths[f].instance === 'String',
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
        OrderModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        OrderModel.countDocuments(query),
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
      const { id } = req.params;
      const data = await OrderModel.findById(id);
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
    const session = await mongoose.startSession();
    try {
      await session.startTransaction();
      const { order, order_items } = req.validatedData;
      const customer = await CustomerModel.findById(req.user._id);
      if (!customer) {
        return next(new ApiError(404, `NOT FOUND SUCH A CUSTOMER ID!`));
      }
      const deliveryStaffId = await DeliveryStaffModel.findById(order.delivery_staff_id,);
      if (!deliveryStaffId) {
        return next(new ApiError(404, `NOT FOUND SUCH A DELIVERY STAFF ID!`));
      }
       const newOrder = await OrderModel.create([{ ...order, customer_id: customer._id }], { session })
      const createOrder = newOrder[0]; 
      const selectedOrderItems = []; 
      let sum = 0; 
      for(const item of order_items){
        let product  = await WaterProductModel.findById(item.product_id);
      if(!product){
        return next(new ApiError(404, `NOT FOUND SUCH A PRODUCT ID!`));
      }
      if (product.quantity <  item.quantity) {
        return next(new ApiError(404, `NOT ENOUGH PRODUCTS AS REQUIRED in this id: ${item.product_id}. Available: ${product.quantity}, Requested: ${item.quantity}`));
      }
      product.quantity = product.quantity - item.quantity;

      await product.save({session});
      let orderItemData= {
            order_id: createOrder._id, 
            product_id: product._id,
            quantity: item.quantity,
            price: product.price,
            total_price: item.quantity * product.price, 
        }
      let newOrderItem = await OrderItemModel.create([orderItemData], { session });
        selectedOrderItems.push(newOrderItem[0]);
        sum += newOrderItem[0].total_price;
      }   
      createOrder.status = `ordered`;
      await createOrder.save();
      await orderMailer(customer.email, `ORDERED SUCCESSFULLY!`);
      await session.commitTransaction();
      await session.endSession();
      return res.status(201).json({
        success: true,
        message: `ORDER CREATED SUCCESSFULLY!`,
        order: createOrder,
        order_items: selectedOrderItems,
        sum
      });
    } catch (error) {
      await orderMailer(req.user.email, `ORDERED SUCCESSFULLY!`);
      await session.abortTransaction();
      await session.endSession();
      return next(error);
    }
  },
  
//   updateOne: async (req, res, next) => {
//     const session = await mongoose.startSession();
//     try {
//         await session.startTransaction();
//         const { id } = req.params;
//         const orderCheck = await OrderModel.findById([id], {session})
//         if(!orderCheck){
//           return res.status(404).json({success: false, message: `NOT FOUND SUCH AN ORDER ID!`, order_id: id})
//         }
//         const { order, order_items } = req.validatedData;
//         if(order.delivery_staff_id){
//         const deliveryStaffCheck = await DeliveryStaffModel.findById([order.delivery_staff_id], {session})
//         if(!deliveryStaffCheck){
//           return res.status(404).json({success: false, message: `NOT FOUND SUCH A DELIVERY STAFF ID!`})
//         }
//         }
//         let totalOrderPrice = 0;
//         const updatedOrderItems = [];
//         if (order_items && order_items.length > 0) {
//             for (const item of order_items) {
//               let product = await WaterProductModel.findById([item.product_id], {session});
//                 if (!product) {
//                     throw new ApiError(404, `Product not found for ID: ${item.product_id}`);
//                 }
//               let itemTotalPrice = item.quantity * product.price;
//                 totalOrderPrice = totalOrderPrice + itemTotalPrice ;

//                 updatedOrderItems.push({
//                     product_id: product._id,
//                     quantity: item.quantity,
//                     price: product.price, 
//                     total_price: itemTotalPrice
//                 });
//             }
//         }
//         const updateFields = { ...order }; 
//         if (order_items && order_items.length > 0) {
//             updateFields.total_price = totalOrderPrice;
//             updateFields.order_items = updatedOrderItems; 
//         } else {
//         const updatedOrder = await OrderModel.findByIdAndUpdate(id, updateFields, { new: true, session });

//         if (!updatedOrder) {
//             await session.abortTransaction();
//             await session.endSession();
//             return next(new ApiError(404, `ORDER WITH ID ${id} NOT FOUND!`));
//         }
//         await session.commitTransaction();
//         await session.endSession();
//         return res.status(200).json({
//             success: true,
//             message: `ORDER UPDATED SUCCESSFULLY!`,
//             order: updatedOrder, 
//         });}
//     } catch (error) {
//         await session.abortTransaction();
//         await session.endSession();
//         return next(error);
//     }
// },

  deleteOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await OrderModel.findByIdAndDelete(id);
      if (!data) {
       return next(new ApiError(404,`NOT FOUND SUCH AN ID` ))
      }
      data.status = 'cancelled'
      await data.save()
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
