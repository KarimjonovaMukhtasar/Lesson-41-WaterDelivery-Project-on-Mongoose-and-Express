import CustomerModel from '../models/customer.model.js';
import DeliveryStaffModel from '../models/deliveryStaff.model.js';
import { verifyToken, generateToken } from '../helper/jwt.js';
import { config } from '../config/index.js';

export const loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;
    const data = await CustomerModel.findOne({ email });
    if (data.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: `NOT FOUND SUCH A CUSTOMER EMAIL`,
          email,
        });
    }
    const validPassword = data.comparePassword(password);
    if (!validPassword) {
      return res
        .status(404)
        .json({ success: false, message: `INVALID EMAIL OR PASSWORD!` });
    }
    const accessPayload = { id: data._id, name: data.name, email: data.email };
    const accessToken = await generateToken(
      accessPayload,
      config.jwt.accessSecret,
      '7d',
    );

    const refreshPayload = { id: data._id, name: data.name, email: data.email };
    const refreshToken = await generateToken(
      refreshPayload,
      config.jwt.refreshSecret,
      '30d',
    );
    data.accessToken = accessToken;
    data.refreshToken = refreshToken;
    const { password, ...rest } = data;
    return res
      .status(200)
      .json({ success: true, message: `SUCCESSFULLY LOGGED IN!`, data: rest });
  } catch (error) {
    return next(error);
  }
};

export const registerCustomer = async (req, res, next) => {
  try {
    const { email } = req.validatedData;
    const data = await CustomerModel.findOne({ email });
    if (data.length !== 0) {
      return res
        .status(404)
        .json({ success: false, message: `THIS EMAIL ALREADY EXISTS`, email });
    }
    const newData = await CustomerModel.create(req.validatedData);
    const accessPayload = { id: data._id, name: data.name, email: data.email };
    const accessToken = await generateToken(
      accessPayload,
      config.jwt.accessSecret,
      '7d',
    );
    const refreshPayload = { id: data._id, name: data.name, email: data.email };
    const refreshToken = await generateToken(
      refreshPayload,
      config.jwt.refreshSecret,
      '30d',
    );
    newData.accessToken = accessToken;
    newData.refreshToken = refreshToken;
    const { password, ...rest } = newData;
    return res
      .status(200)
      .json({
        success: true,
        message: `SUCCESSFULLY REGISTERED!`,
        data: rest,
      });
  } catch (error) {
    return next(error);
  }
};

export const loginStaff = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;
    const data = await DeliveryStaffModel.findOne({ email: email });
    if (!data.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: `NOT FOUND SUCH A STAFF EMAIL`,
          email,
        });
    }
    const validPassword = data.comparePassword(password);
    if (!validPassword) {
      return res
        .status(404)
        .json({ success: false, message: `INVALID EMAIL OR PASSWORD!` });
    }
    const accessPayload = { id: data._id, name: data.name, email: data.email };
    const accessToken = await generateToken(
      accessPayload,
      config.jwt.accessSecret,
      '7d',
    );

    const refreshPayload = { id: data._id, name: data.name, email: data.email };
    const refreshToken = await generateToken(
      refreshPayload,
      config.jwt.refreshSecret,
      '30d',
    );
    data.accessToken = accessToken
    data.refreshToken = refreshToken
    const {password, ...rest} = data
    return res
      .status(200)
      .json({
        success: true,
        message: `SUCCESSFULLY LOGGED IN!`,
        data: rest,
      });
  } catch (error) {
    return next(error);
  }
};

export const registerStaff = async (req, res, next) => {
   try {
    const { email } = req.validatedData;
    const data = await DeliveryStaffModel.findOne({ email });
    if (data.length !== 0) {
      return res
        .status(404)
        .json({ success: false, message: `THIS EMAIL ALREADY EXISTS`, email });
    }
    const newData = await DeliveryStaffModel.create(req.validatedData);
    const accessPayload = { id: data._id, name: data.name, email: data.email };
    const accessToken = await generateToken(
      accessPayload,
      config.jwt.accessSecret,
      '7d',
    );
    const refreshPayload = { id: data._id, name: data.name, email: data.email };
    const refreshToken = await generateToken(
      refreshPayload,
      config.jwt.refreshSecret,
      '30d',
    );
    newData.accessToken = accessToken;
    newData.refreshToken = refreshToken;
    const { password, ...rest } = newData;
    return res
      .status(200)
      .json({
        success: true,
        message: `SUCCESSFULLY REGISTERED!`,
        data: rest,
      });
  } catch (error) {
    return next(error);
  }
};

export const profileCustomer = async (req, res, next) => {
  try {
    const user = req.user
    return res.status(200).send({data: user})
    } catch (error) {
    return next(error);
  }
};

export const profileStaff = async (req, res, next) => {
  try {
    const user = req.user
    return res.status(200).send({data: user})
    } catch (error) {
    return next(error);
  }
};

export const refreshAccessCustomer = async(req,res,next) =>{
  try{
    const data = req.validatedData
    const refreshToken = data.refreshToken
    const verifiedToken = verifyToken(refreshToken, config.jwt.refreshSecret)
    const user = CustomerModel.findOne({_id: verified.id})
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name
    }
    const accessToken = await generateToken(payload, config.jwt.accessSecret, '7d')
    return res.status(200).json({success: true, message: `REFRESHED THE ACCESSTOKEN SUCCESSFULLY!`})
  }catch(e){
    return next(e)
  }
}

export const refreshAccessStaff = async(req,res,next) =>{
  try{
    const data = req.validatedData
    const refreshToken = data.refreshToken
    const verifiedToken = verifyToken(refreshToken, config.jwt.refreshSecret)
    const user = DeliveryStaffModel.findOne({_id: verified.id})
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name
    }
    const accessToken = await generateToken(payload, config.jwt.accessSecret, '7d')
    return res.status(200).json({success: true, message: `REFRESHED THE ACCESSTOKEN SUCCESSFULLY!`})
  }catch(e){
    return next(e)
  }
}
