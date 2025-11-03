import CustomerModel from '../models/customer.model.js';
import { verifyToken, generateToken } from '../helper/jwt.js';
import bcrypt from 'bcrypt';
import { config } from '../config/index.js';
import { ApiError } from '../helper/errorMessage.js';
import { OtpModel } from '../models/otp.model.js';
import { generateOtp } from '../helper/otp.js';
import { mailer } from '../helper/nodeMailer.js';
import mongoose from 'mongoose';

export const login = async (req, res, next) => {
  try {
    const { email } = req.validatedData;
    const data = await CustomerModel.findOne({ email });
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
    data.accessToken = accessToken;
    data.refreshToken = refreshToken;
    await data.save();
    const plainData = data.toObject();
    const { password, ...rest } = plainData;
    return res.status(200).json({
      success: true,
      message: `SUCCESSFULLY LOGGED IN!`,
      data: rest,
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

    const accessPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const refreshPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = await generateToken(
      accessPayload,
      config.jwt.accessSecret,
      '7d',
    );
    const refreshToken = await generateToken(
      refreshPayload,
      config.jwt.refreshSecret,
      '30d',
    );

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    await user.save({ session });
    const otp = await generateOtp();
    await mailer(user.email, otp);
    await OtpModel.create([{ otp, user_id: user._id }], { session });

    await session.commitTransaction();
    await session.endSession();

    const { password, ...rest } = user.toObject();
    return res.status(200).json({
      success: true,
      message: 'SUCCESSFULLY REGISTERED!',
      data: rest,
      tokens: { accessToken, refreshToken },
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
    const user = await CustomerModel.findById(req.user.id);
    if (!user) {
      return next(
        new ApiError(404, `NOT FOUND SUCH A PROFILE, PLEASE REGISTER FIRST!`),
      );
    }
    const plainData = user.toObject();
    const { password, ...rest } = plainData;
    return res.status(200).send({ success: true, data: rest });
  } catch (error) {
    return next(error);
  }
};

export const refreshAccess = async (req, res, next) => {
  try {
    const data = req.body;
    let refreshToken = data.refreshToken;
    if (refreshToken.startsWith('"') && refreshToken.endsWith('"')) {
      refreshToken = refreshToken.substring(1, refreshToken.length - 1);
    }
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
    return res.status(200).json({
      success: true,
      message: `REFRESHED THE ACCESSTOKEN SUCCESSFULLY!`,
      accessToken,
    });
  } catch (e) {
    return next(e);
  }
};

export const verifyOtp = async (req, res, next) => {
  const session = mongoose.startSession();
  try {
    await session.startTransaction();
    const data = req.validatedData;
    const user = req.user;
    const userId = user.id;

    const otpData = await OtpModel.findOne(
      {
        otp: data.verifyOtp,
        userId,
      },
      { session },
    );

    console.log(otpData);

    if (!otpData) {
      return next(new ApiError(404), `INVALID ONE TIME PASSWORD`);
    }

    await CustomerModel.findByIdAndUpdate(
      userId,
      {
        isActive: true,
      },
      { new: true },
      { session },
    );

    await OtpModel.findByIdAndDelete(otpData._id, { session });
    await session.commitTransaction();
    await session.endTransaction();
    return res
      .status(200)
      .json({ success: true, message: `THIS OTP IS VALID/ACTIVE` });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return next(error);
  }
};
