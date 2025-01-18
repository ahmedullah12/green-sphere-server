import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import NotificationService from './notification.service';

const getNotifications = catchAsync(async (req, res) => {
  const result = await NotificationService.getNotifications(req.user._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications Fetched Successfully!!!',
    data: result,
  });
});


export const NotificationController = {
    getNotifications
}