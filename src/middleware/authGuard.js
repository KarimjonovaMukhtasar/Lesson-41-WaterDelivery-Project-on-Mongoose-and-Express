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
    let token = authHeader.split(' ')[1];
     if (token.startsWith('"') && token.endsWith('"')) {
      token = token.substring(1, token.length - 1);
    }
    let validToken;
    try {
      validToken = verifyToken(token, config.jwt.accessSecret);
    } catch (err) {
      return next(new ApiError(401, `INVALID OR EXPIRED TOKEN! ${err}`));
    }

    let user;
    switch (validToken.role) {
      case 'customer':
        user = await CustomerModel.findById(validToken.id);
        break;
      case 'staff': 
        user = await DeliveryStaffModel.findById(validToken.id);
        break;
      default:
        return next(new ApiError(404, `NOT FOUND SUCH A USER/STAFF ID`));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};
