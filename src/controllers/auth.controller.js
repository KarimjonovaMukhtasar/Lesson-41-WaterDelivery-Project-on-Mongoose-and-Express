import CustomerModel from '../models/customer.model.js';
import DeliveryStaffModel from '../models/deliveryStaff.model.js';

export const loginCustomer = async (req, res, next) => {
  try{
    const {email, password} = req.validatedData
    const data = await CustomerModel.findOne({email: email})
    if(!data.length === 0){
      
    } 
  } catch (error) {
    return next(error);
  }
};

export const loginStaff = async (req, res, next) => {
  try {
    sdfd;
  } catch (error) {
    return next(error);
  }
};

export const registerCustomer = async (req, res, next) => {
      try{
        sdfd 
    }catch(error){
        return next(error)
    }
};

export const registerStaff = async (req, res, next) => {
      try{
        sdfd 
    }catch(error){
        return next(error)
    }
};

export const profileCustomer = async (req, res, next) => {
      try{
        sdfd 
    }catch(error){
        return next(error)
    }
};

export const profileStaff = async (req, res, next) => {
      try{
        sdfd 
    }catch(error){
        return next(error)
    }
};
