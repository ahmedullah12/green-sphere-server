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

const updateProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.updateProfile(id, req.body);



  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Updated Successfully!!!',
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

export const UserController = {
  getUser,
  updateProfile,
  followUser,
  unfollowUser,
};
