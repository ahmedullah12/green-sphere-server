import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CommentServices } from './comment.service';

const createComment = catchAsync(async (req, res) => {
  const result = await CommentServices.createComment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment Added Successfully!!!',
    data: result,
  });
});

const getComments = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CommentServices.getComments(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments Fetched Successfully!!!',
    data: result,
  });
});

export const CommentController = {
  createComment,
  getComments,
};
