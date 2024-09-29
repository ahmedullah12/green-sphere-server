import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TLoginUser, TRegisterUser } from './auth.interface';
import { createToken } from '../../utils/verifyJwt';
import { User } from '../User/user.model';
import config from '../../config';

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


export const AuthServices = {
    registerUser,
    loginUser,
}