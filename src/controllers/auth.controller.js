import CustomerModel from '../models/customer.model.js';
import { verifyToken, generateToken } from '../helper/jwt.js';
import bcrypt from 'bcrypt';
import { config } from '../config/index.js';
import { ApiError } from '../helper/errorMessage.js';
import { OtpModel } from '../models/otp.model.js';
import { generateOtp } from '../helper/otp.js';
import { mailer } from '../helper/nodeMailer.js';
import mongoose from 'mongoose';
import AdminModel from '../models/admin.model.js';
import DeliveryStaffModel from '../models/deliveryStaff.model.js';


export const login = async (req, res, next) => {
  try {
    const { email } = req.validatedData;
    const data = await CustomerModel.findOne({ email }).select('+password');
    if (!data) {
      return next(new ApiError(404, `NOT FOUND SUCH A CUSTOMER EMAIL`));
    }
    const validPassword = await bcrypt.compare(
      req.validatedData.password,
      data.password,
    );
    if (!validPassword) {
      return next(new ApiError(404, `INVALID EMAIL OR PASSWORD!`));
    }
    const accessPayload = {
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    const accessToken = await generateToken(
      accessPayload,
      config.jwt.accessSecret,
      '7d',
    );
    const refreshPayload = {
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    const refreshToken = await generateToken(
      refreshPayload,
      config.jwt.refreshSecret,
      '30d',
    );
    res.cookie('accessToken', accessToken,  { maxAge: 2592000000})
    res.cookie('refreshToken', refreshToken, {maxAge: 2592000000})
    return res.status(200).json({
      success: true,
      message: `SUCCESSFULLY LOGGED IN!`,
      data,
      tokens: { accessToken, refreshToken },
    });
  } catch (error) {
    return next(error);
  }
};

export const register = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const { email } = req.validatedData;
    const existing = await CustomerModel.findOne({ email }).session(session);
    if (existing) {
      await session.abortTransaction();
      await session.endSession();
      return next(new ApiError(403, 'THIS EMAIL ALREADY EXISTS'));
    }

    const newData = await CustomerModel.create([req.validatedData], {
      session,
    });
    const user = newData[0];
    await user.save({ session });
    delete user.password
    const otp = await generateOtp();
    await mailer(user.email, otp);
  
    await OtpModel.create([{ otp, user_id: user._id }], { session });
    await session.commitTransaction();
    await session.endSession();
    delete user.password
    return res.status(200).json({
      success: true,
      message: 'SUCCESSFULLY REGISTERED!',
      data: user,
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return next(error);
  }
};

export const profile = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new ApiError(401, `UNAUTHORIZED!`));
    }
    let user;
    if (req.user.role === 'customer') {
      user = await CustomerModel.findById(req.user.id);
    }
    if (req.user.role === 'admin') {
      user = await AdminModel.findById(req.user.id);
    }
    if (!user) {
      return next(
        new ApiError(404, `NOT FOUND SUCH A PROFILE, PLEASE REGISTER FIRST!`),
      );
    }
    // const plainData = user.toObject();
    // const { password, ...rest } = plainData;
    return res.status(200).send({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
};

export const refreshAccess = async (req, res, next) => {
  try {
    let { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'No refresh token provided',
      });
    }
    if (refreshToken.startsWith('"') && refreshToken.endsWith('"')) {
      refreshToken = refreshToken.slice(1, -1);
    }

    let decoded;
    try {
      decoded = verifyToken(refreshToken, config.jwt.refreshSecret);
      if(decoded){
         return res.status(200).json({
        success: true,
        message: 'The given token is still in use no need to refresh it!',
      });
      }
    } catch (err) {
      console.warn(err.message);
      return res.status(200).json({
        success: true,
        message: 'Invalid or expired refresh token. Please, log in again.',
      });
    }
    let user;
    switch (decoded.role) {
      case 'customer':
        user = await CustomerModel.findById(decoded.id);
        break;
      case 'admin':
        user = await AdminModel.findById(decoded.id);
        break;
      case 'staff':
        user = await DeliveryStaffModel.findById(decoded.id);
        break;
      default:
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User no longer exists' });
    }
    const payload = {
      id: user._id,
      email: user.email,
      role: decoded.role,
    };

    const newAccessToken = generateToken(payload, config.jwt.accessSecret, '7d');
    const newRefreshToken = generateToken(payload, config.jwt.refreshSecret, '30d');

    return res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully!',
      newTokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });

  } catch (e) {
    next(e);
  }
};


export const verifyOtp = async (req, res, next) => {
  const session = await mongoose.startSession(); //1
  try {
    await session.startTransaction(); //2
    const userId = req.user._id.toString();
    const otpData = await OtpModel.findOne({
      otp: req.body.verifyOtp,
      user_id: userId,
    });
    if (!otpData) {
      return next(new ApiError(404, `INVALID ONE TIME PASSWORD`));
    }
    if (req.user.role === 'customer') {
      await CustomerModel.findByIdAndUpdate(
        userId,
        {
          isActive: true,
        },
        { new: true, session },
      );
    }
    if (req.user.role === 'admin') {
      await AdminModel.findByIdAndUpdate(
        userId,
        {
          isActive: true,
        },
        { new: true, session },
      );
    }
    await OtpModel.findByIdAndDelete(otpData._id, { session });
    await session.commitTransaction();
    await session.endSession();
    return res
      .status(200)
      .json({
        success: true,
        message: `CONGRATULATIONS! YOUR PROFILE IS ACTIVE NOW! THIS OTP IS VALID /ACTIVE`,
      });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return next(error);
  }
};

export const createAdmin = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const { email } = req.validatedData;
    const existing = await AdminModel.findOne({ email }).session(session);
    if (existing) {
      await session.abortTransaction();
      await session.endSession();
      return next(new ApiError(403, 'THIS EMAIL ALREADY EXISTS'));
    }
    const newData = await AdminModel.create([req.validatedData], {
      session,
    });
    const user = newData[0];
    await user.save({ session });
    const otp = await generateOtp();
    await mailer(user.email, otp);
    await OtpModel.create([{ otp, user_id: user._id }], { session });

    await session.commitTransaction();
    await session.endSession();
    delete user.password
    return res.status(200).json({
      success: true,
      message: 'SUCCESSFULLY CREATED THE ADMIN!',
      data: user,
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email } = req.validatedData;
    const data = await AdminModel.findOne({ email }).select('+password');
    if (!data) {
      return next(new ApiError(404, `NOT FOUND SUCH AN ADMIN EMAIL`));
    }
    const validPassword = await bcrypt.compare(
      req.validatedData.password,
      data.password,
    );
    if (!validPassword) {
      return next(new ApiError(404, `INVALID EMAIL OR PASSWORD!`));
    }
    const accessPayload = {
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    const accessToken = await generateToken(
      accessPayload,
      config.jwt.accessSecret,
      '7d',
    );
    const refreshPayload = {
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    const refreshToken = await generateToken(
      refreshPayload,
      config.jwt.refreshSecret,
      '30d',
    );
    // const plainData = data.toObject();
    // const { password, ...rest } = plainData;
    res.cookie('accessToken', accessToken,  { maxAge: 2592000000})
    res.cookie('refreshToken', refreshToken, {maxAge: 2592000000})
    return res.status(200).json({
      success: true,
      message: `SUCCESSFULLY LOGGED IN!`,
      data,
      tokens: { accessToken, refreshToken },
    });
  } catch (error) {
    return next(error);
  }
};
