import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { GroupServices } from './group.service';

const createGroup = catchAsync(async (req, res) => {
  const result = await GroupServices.createGroup({
    ...req.body,
    creator: req.user._id,
    avatar: req.file?.path,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group Created Successfully!!!',
    data: result,
  });
});

const getAllGroups = catchAsync(async (req, res) => {
  const result = await GroupServices.getAllGroups(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Groups Fetched Successfully!!!',
    data: result,
  });
});

const joinGroup = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const result = await GroupServices.joinGroup(groupId, req.user._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Joined Group Successfully!!!',
    data: result,
  });
});

const leaveGroup = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const result = await GroupServices.leaveGroup(groupId, req.user._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Left Group Successfully!!!',
    data: result,
  });
});

const getSingleGroup = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const result = await GroupServices.getSingleGroup(groupId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group Fetched Successfully!!!',
    data: result,
  });
});

const updateGroup = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const result = await GroupServices.updateGroup(
    groupId,
    req.body,
    req.user._id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group Updated Successfully!!!',
    data: result,
  });
});

const deleteGroup = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const result = await GroupServices.deleteGroup(groupId, req.user._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group Deleted Successfully!!!',
    data: result,
  });
});

const getMyGroups = catchAsync(async (req, res) => {
  const result = await GroupServices.getMyGroups(req.user._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Groups Fetched Successfully!!!',
    data: result,
  });
});

export const GroupController = {
  createGroup,
  getAllGroups,
  getSingleGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  getMyGroups,
};
