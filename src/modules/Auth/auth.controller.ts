import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import { AuthServices } from './auth.service';
import AppError from '../../errors/AppError';

const registerUser = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError(400, 'Please upload an image');
  }

  const result = await AuthServices.registerUser({...req.body, profilePhoto: req.file?.path});
  const { refreshToken, accessToken } = result;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered in successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

export const AuthController = {
    registerUser,
    loginUser,
}