import { config } from '../config/index.js';
import { verifyToken } from '../helper/jwt.js';
import { ApiError } from '../helper/errorMessage.js';
import CustomerModel from '../models/customer.model.js';
import DeliveryStaffModel from '../models/deliveryStaff.model.js';

export const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError(401, `UNAUTHORIZED`));
    }
    const token = authHeader.split(' ')[1];
    const validToken = verifyToken(token, config.jwt.accessSecret);
    if (!validToken) {
      return next(new ApiError(401, `EXPIRED TOKEN!`));
    }
    let user;
    switch (validToken.role) {
      case 'customer':
        user = await CustomerModel.findById({ id: validToken.id });
        break;
      case 'staff': 
        user = await DeliveryStaffModel.findById({id: validToken.id});
        break;
      default:
        return next(new ApiError(404, `NOT FOUND SUCH A USER/STAFF ID`));
    }
    req.user = user
  } catch (error) {
    return next(error);
  }
};