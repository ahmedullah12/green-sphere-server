import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TLoginUser, TRegisterUser } from './auth.interface';
import { createToken } from '../../utils/verifyJwt';
import { User } from '../User/user.model';
import config from '../../config';
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';

const registerUser = async (payload: TRegisterUser) => {
  // check if the user already exists
  const user = await User.isUserExistsByEmail(payload?.email);

  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is already exist!');
  }

  const newUser = await User.create(payload);

  const jwtPayload = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    profilePhoto: newUser.profilePhoto as string,
    role: newUser.role,
  };

  const refreshToken = createToken(
    jwtPayload,
    config.refresh_token_secret as string,
    config.refresh_token_expires_in as string,
  );

  const accessToken = createToken(
    jwtPayload,
    config.access_token_secret as string,
    config.access_token_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  //checking if the password is correct
  const isPasswordMatched = await User.isPasswordMatched(
    payload?.password,
    user?.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePhoto: user.profilePhoto as string,
    role: user.role,
  };

  const refreshToken = createToken(
    jwtPayload,
    config.refresh_token_secret as string,
    config.refresh_token_expires_in as string,
  );

  const accessToken = createToken(
    jwtPayload,
    config.access_token_secret as string,
    config.access_token_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};


const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.refresh_token_secret as string
  ) as JwtPayload;

  const { email, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }


  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePhoto: user.profilePhoto as string,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.access_token_secret as string,
    config.access_token_expires_in as string
  );

  return {
    accessToken,
  };
};


const changePassword = async (
  userId: string,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.isUserExistsById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    12,
  );

  await User.findByIdAndUpdate(
    user._id,
    {
      password: newHashedPassword,
    },
  );

  return null;
};

const forgetPassword = async (userEmail: string) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(userEmail);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePhoto: user.profilePhoto as string,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.access_token_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user._id}&token=${resetToken} `;

  await sendEmail(user.email, resetUILink);

  console.log(resetUILink);
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const decoded = jwt.verify(
    token,
    config.access_token_secret as string,
  ) as JwtPayload;


  if (payload.email !== decoded.email) {
    console.log(payload.email, decoded.email);
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    12,
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
    },
  );
};


export const AuthServices = {
    registerUser,
    loginUser,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword
}