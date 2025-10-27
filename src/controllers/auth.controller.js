import CustomerModel from '../models/customer.model.js';
import DeliveryStaffModel from '../models/deliveryStaff.model.js';
import { verifyToken, generateToken } from '../helper/jwt.js';
import bcrypt from 'bcrypt';
import { config } from '../config/index.js';

export const loginCustomer = async (req, res, next) => {
  try {
    const { email } = req.validatedData;
    const data = await CustomerModel.findOne({ email });
    console.log(data);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: `NOT FOUND SUCH A CUSTOMER EMAIL`,
        email,
      });
    }
    const validPassword = await bcrypt.compare(
      req.validatedData.password,
      data.password,
    );
    if (!validPassword) {
      return res
        .status(404)
        .json({ success: false, message: `INVALID EMAIL OR PASSWORD!` });
    }
    const accessPayload = { name: data.name, email: data.email };
    const accessToken = await generateToken(
      accessPayload,
      config.jwt.accessSecret,
      '7d',
    );

    const refreshPayload = {name: data.name, email: data.email };
    const refreshToken = await generateToken(
      refreshPayload,
      config.jwt.refreshSecret,
      '30d',
    );
    data.accessToken = accessToken;
    console.log(accessToken);
    
    data.refreshToken = refreshToken;
    console.log(refreshToken);
    
    await data.save()
    const plainData = data.toObject();
    const { password, ...rest } = plainData;
    return res
      .status(200)
      .json({ success: true, message: `SUCCESSFULLY LOGGED IN!`, data: rest, tokens: {accessToken, refreshToken} });
  } catch (error) {
    return next(error);
  }
};

export const registerCustomer = async (req, res, next) => {
  try {
    console.log('CONTROLLER REACHED!');
    const { email } = req.validatedData;
    console.log(req.validatedData);
    const data = await CustomerModel.findOne({ email });
    console.log(data);
    if (data) {
      return res
        .status(404)
        .json({ success: false, message: `THIS EMAIL ALREADY EXISTS`, email });
    }
    const newData = await CustomerModel.create(req.validatedData);
    const accessPayload = { name: newData.name, email: newData.email };
    const accessToken = await generateToken(
      accessPayload,
      config.jwt.accessSecret,
      '7d',
    );
    const refreshPayload = { name: newData.name, email: newData.email };
    const refreshToken = await generateToken(
      refreshPayload,
      config.jwt.refreshSecret,
      '30d',
    );
    newData.accessToken = accessToken;
    newData.refreshToken = refreshToken;
    await newData.save()
    const plainData = newData.toObject();
    const { password, ...rest } = plainData;
    return res.status(200).json({
      success: true,
      message: `SUCCESSFULLY REGISTERED!`,
      data: rest,
      tokens: {accessToken, refreshToken} 
    });
  } catch (error) {
    return next(error);
  }
};

export const loginStaff = async (req, res, next) => {
  try {
    const { email } = req.validatedData;
    const data = await DeliveryStaffModel.findOne({ email: email });
    if (!data) {
      return res.status(404).json({
        success: false,
        message: `NOT FOUND SUCH A STAFF EMAIL`,
        email,
      });
    }
    const validPassword = await bcrypt.compare(
      req.validatedData.password,
      data.password,
    );
    if (!validPassword) {
      return res
        .status(404)
        .json({ success: false, message: `INVALID EMAIL OR PASSWORD!` });
    }
    const accessPayload = { name: data.name, email: data.email };
    const accessToken = await generateToken(
      accessPayload,
      config.jwt.accessSecret,
      '7d',
    );

    const refreshPayload = { name: data.name, email: data.email };
    const refreshToken = await generateToken(
      refreshPayload,
      config.jwt.refreshSecret,
      '30d',
    );
    data.accessToken = accessToken;
    data.refreshToken = refreshToken;
    await data.save()
    const plainData = data.toObject();
    const { password, ...rest } = plainData;
    return res.status(200).json({
      success: true,
      message: `SUCCESSFULLY LOGGED IN!`,
      data: rest,
      tokens: {accessToken, refreshToken} 
    });
  } catch (error) {
    return next(error);
  }
};

export const registerStaff = async (req, res, next) => {
  try {
    const { email } = req.validatedData;
    const data = await DeliveryStaffModel.findOne({ email });
    if (data) {
      return res
        .status(404)
        .json({ success: false, message: `THIS EMAIL ALREADY EXISTS`, email });
    }
    const newData = await DeliveryStaffModel.create(req.validatedData);
    const accessPayload = { name: newData.name, email: newData.email };
    const accessToken = await generateToken(
      accessPayload,
      config.jwt.accessSecret,
      '7d',
    );
    const refreshPayload = { name: newData.name, email: newData.email };
    const refreshToken = await generateToken(
      refreshPayload,
      config.jwt.refreshSecret,
      '30d',
    );
    newData.accessToken = accessToken;
    newData.refreshToken = refreshToken;
    await newData.save()
    const plainData = newData.toObject();
    const { password, ...rest } = plainData;
    return res.status(200).json({
      success: true,
      message: `SUCCESSFULLY REGISTERED!`,
      data: rest,
      tokens: {accessToken, refreshToken} 
    });
  } catch (error) {
    return next(error);
  }
};

export const profileCustomer = async (req, res, next) => {
  try {
    const user = req.user;
    return res.status(200).send({ data: user });
  } catch (error) {
    return next(error);
  }
};

export const profileStaff = async (req, res, next) => {
  try {
    const user = req.user;
    return res.status(200).send({ data: user });
  } catch (error) {
    return next(error);
  }
};

export const refreshAccessCustomer = async (req, res, next) => {
  try {
    const data = req.validatedData;
    const refreshToken = data.refreshToken;
    const verifiedToken = verifyToken(refreshToken, config.jwt.refreshSecret);
    const user = await CustomerModel.findOne({ _id: verifiedToken.id });
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    const accessToken = await generateToken(
      payload,
      config.jwt.accessSecret,
      '7d',
    );
    await data.save();
    return res.status(200).json({
      success: true,
      message: `REFRESHED THE ACCESSTOKEN SUCCESSFULLY!`,
      accessToken,
    });
  } catch (e) {
    return next(e);
  }
};

export const refreshAccessStaff = async (req, res, next) => {
  try {
    const data = req.validatedData;
    const refreshToken = data.refreshToken;
    const verifiedToken = verifyToken(refreshToken, config.jwt.refreshSecret);
    const user = await DeliveryStaffModel.findOne({ _id: verifiedToken.id });
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    const accessToken = await generateToken(
      payload,
      config.jwt.accessSecret,
      '7d',
    );
    await data.save();
    return res.status(200).json({
      success: true,
      message: `REFRESHED THE ACCESSTOKEN SUCCESSFULLY!`,
      accessToken,
    });
  } catch (e) {
    return next(e);
  }
};
