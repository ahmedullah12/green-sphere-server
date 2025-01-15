import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TGoogleUserInfo, TLoginUser, TRegisterUser } from './auth.interface';
import { createToken } from '../../utils/verifyJwt';
import { User } from '../User/user.model';
import config from '../../config';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';
import { OAuth2Client } from 'google-auth-library';
import { USER_ROLE } from '../User/user.constant';

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

  if (user.provider === 'google' || !user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Please login with different provider',
    );
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

const dataobj = {
  clientId: config.google_client_id as string,
  clientSecret: config.google_client_secret as string,
  redirectUri: `${config.server_url}/api/auth/google/callback`,
}

const oauth2Client = new OAuth2Client(dataobj);

// Generate Google OAuth URL
const getGoogleAuthURL = () => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
  });
};

const googleCallback = async (code: string) => {
  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const userInfoClient = oauth2Client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
    });

    const { data } = (await userInfoClient) as { data: TGoogleUserInfo };

    // Check if user exists
    let user = await User.isUserExistsByEmail(data.email);

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name: data.name,
        email: data.email,
        profilePhoto: data.picture,
        provider: 'google',
        role: USER_ROLE.USER,
      });
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
  } catch (error: any) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      error.message,
    );
  }
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.refresh_token_secret as string,
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
    config.access_token_expires_in as string,
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
  if (
    !(await User.isPasswordMatched(
      payload.oldPassword,
      user?.password as string,
    ))
  )
    throw new AppError(httpStatus.FORBIDDEN, 'Old password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await User.findByIdAndUpdate(user._id, {
    password: newHashedPassword,
  });

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
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(payload.newPassword, 12);

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
  getGoogleAuthURL,
  googleCallback,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
