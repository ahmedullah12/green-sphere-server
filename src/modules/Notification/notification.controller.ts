import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import NotificationService from './notification.service';

const getNotifications = catchAsync(async (req, res) => {
  console.log(req.user);
  const result = await NotificationService.getNotifications(req.user._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications Fetched Successfully!!!',
    data: result,
  });
});

const markAllAsRead = catchAsync(async (req, res) => {
  console.log(req.user);
  const result = await NotificationService.markAllAsRead(req.user._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All notifications marked as read successfully',
    data: result,
  });
});


export const NotificationController = {
    getNotifications,
    markAllAsRead
}