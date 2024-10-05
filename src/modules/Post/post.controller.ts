import httpStatus from 'http-status';
import { TImageFiles } from '../../interface/image.type';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';
import mongoose from 'mongoose';

const createPost = catchAsync(async (req, res) => {
  const result = await PostServices.createPost({
    ...req.body,
    image: req.file,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post Created Successfully!!!',
    data: result,
  });
});

const getAllPosts = catchAsync(async (req, res) => {
  const result = await PostServices.getAllPosts(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Posts Fetched Successfully!!!',
    data: result,
  });
});

const getSinglePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostServices.getSinglePost(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post Fetched Successfully!!!',
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostServices.updatePost(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post Updated Successfully!!!',
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostServices.deletePost(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post Deleted Successfully!!!',
    data: result,
  });
});

const upvotePost = catchAsync(async (req, res) => {
  const { postId, userId } = req.query;

  const result = await PostServices.upvotePost(
    postId as string,
    userId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post Upvoted Successfully!!!',
    data: result,
  });
});

const downvotePost = catchAsync(async (req, res) => {
  const { postId, userId } = req.query;

  const result = await PostServices.downvotePost(
    postId as string,
    userId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post Downvoted Successfully!!!',
    data: result,
  });
});

export const PostController = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
};
