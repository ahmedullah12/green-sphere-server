import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const getUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.getUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Data Fetched Successfully!!!',
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserService.getAllUser();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All User Data Fetched Successfully!!!',
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const image = req.file?.path;

  const updateData = image
    ? { ...req.body, profilePhoto: image }
    : { ...req.body };

  const result = await UserService.updateProfile(id, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Updated Successfully!!!',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.deleteUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Deleted Successfully!!!',
    data: result,
  });
});

const followUser = catchAsync(async (req, res) => {
  const result = await UserService.followUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Followed Successfully!!!',
    data: [],
  });
});
const unfollowUser = catchAsync(async (req, res) => {
  const result = await UserService.unfollowUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unfollowed Successfully!!!',
    data: [],
  });
});

const makeAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.makeAdmin(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Created Successfully!!!',
    data: result,
  });
});

export const UserController = {
  getUser,
  getAllUser,
  updateProfile,
  deleteUser,
  followUser,
  unfollowUser,
  makeAdmin
};
