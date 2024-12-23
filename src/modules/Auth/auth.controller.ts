import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import { AuthServices } from './auth.service';
import AppError from '../../errors/AppError';

const registerUser = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError(400, 'Please upload an image');
  }

  const result = await AuthServices.registerUser({
    ...req.body,
    profilePhoto: req.file?.path,
  });
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

const googleLogin = catchAsync(async (req, res) => {
  const result = await AuthServices.getGoogleAuthURL();
  console.log(result);

  res.redirect(result);
});

const googleCallback = catchAsync(async (req, res) => {
  const code = req.query.code as string;
  const { accessToken, refreshToken } = await AuthServices.googleCallback(code);

  // Redirect to frontend with tokens
  res.redirect(
    `http://localhost:3000/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}`,
  );
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token retrieved successfully!',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await AuthServices.changePassword(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Changed Successfully!',
    data: {},
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const userEmail = req.body.email;
  const result = await AuthServices.forgetPassword(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link is generated successfully!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong !');
  }

  const result = await AuthServices.resetPassword(req.body, token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully!',
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  googleLogin,
  googleCallback,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
