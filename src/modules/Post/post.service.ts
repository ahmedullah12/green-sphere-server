import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TImageFiles } from '../../interface/image.type';
import { postSearchableFields } from './post.constant';
import { TPost } from './post.interface';
import { Post } from './post.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Group } from '../Group/group.model';
import NotificationService from '../Notification/notification.service';
import { Server } from 'socket.io';

const createPost = async (payload: TPost) => {
  const result = await Post.create(payload);

  return result;
};

const getAllPosts = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Post.find().populate('userId'), query)
    .search(postSearchableFields)
    .sort()
    .filter()
    .paginate();
  const result = await postQuery.modelQuery;

  return result;
};

const getSinglePost = async (id: string) => {
  const result = await Post.findById(id).populate('userId');

  return result;
};

const updatePost = async (id: string, payload: Partial<TPost>) => {
  const result = await Post.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

const deletePost = async (id: string) => {
  const result = await Post.findByIdAndDelete(id);

  return result;
};

const upvotePost = async (postId: string, userId: string, io: Server) => {
  const post = await Post.findById(postId).populate('userId');
  const notificationService = new NotificationService(io);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const isDownvoted = post.downvotes
    .map((id) => id.toString())
    .includes(userId);

  if (isDownvoted) {
    // Remove downvote
    post.downvotes = post.downvotes.filter((id) => id.toString() !== userId);
    // Delete downvote notification
    await notificationService.deleteNotification({
      recipient: post.userId._id.toString(),
      sender: userId,
      type: 'downvote',
      post: postId,
    });
  } else {
    const isUpvoted = post.upvotes.map((id) => id.toString()).includes(userId);

    if (isUpvoted) {
      // Remove upvote
      post.upvotes = post.upvotes.filter((id) => id.toString() !== userId);
      // Delete upvote notification
      await notificationService.deleteNotification({
        recipient: post.userId._id.toString(),
        sender: userId,
        type: 'upvote',
        post: postId,
      });
    } else {
      // Add upvote
      const userObjectId = new mongoose.Types.ObjectId(userId);
      post.upvotes.push(userObjectId);
      // Create upvote notification
      await notificationService.createNotification({
        recipient: post.userId._id.toString(),
        sender: userId,
        type: 'upvote',
        post: postId,
      });
    }
  }

  const result = await post.save();
  return result;
};

const downvotePost = async (postId: string, userId: string, io: Server) => {
  const post = await Post.findById(postId).populate('userId');
  const notificationService = new NotificationService(io);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const isUpvoted = post.upvotes.map((id) => id.toString()).includes(userId);
  if (isUpvoted) {
    // Remove upvote
    post.upvotes = post.upvotes.filter((id) => id.toString() !== userId);
    // Delete upvote notification
    await notificationService.deleteNotification({
      recipient: post.userId._id.toString(),
      sender: userId,
      type: 'upvote',
      post: postId,
    });
  } else {
    const isDownvoted = post.downvotes
      .map((id) => id.toString())
      .includes(userId);

    if (isDownvoted) {
      // Remove downvote
      post.downvotes = post.downvotes.filter((id) => id.toString() !== userId);
      // Delete downvote notification
      await notificationService.deleteNotification({
        recipient: post.userId._id.toString(),
        sender: userId,
        type: 'downvote',
        post: postId,
      });
    } else {
      // Add downvote
      const userObjectId = new mongoose.Types.ObjectId(userId);
      post.downvotes.push(userObjectId);
      // Create downvote notification
      await notificationService.createNotification({
        recipient: post.userId._id.toString(),
        sender: userId,
        type: 'downvote',
        post: postId,
      });
    }
  }

  const result = await post.save();
  return result;
};

const getMyPosts = async (userId: string) => {
  const result = await Post.find({ userId })
    .sort('-createdAt')
    .populate('userId');

  return result;
};

const getLikedPosts = async (userId: string) => {
  const result = await Post.find({
    upvotes: { $in: [new mongoose.Types.ObjectId(userId)] },
  })
    .sort('-createdAt')
    .populate('userId');

  return result;
};

const createGroupPost = async (payload: TPost, groupId: string) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  }

  const post = await Post.create({
    ...payload,
    groupId,
  });

  const result = await post.populate(['userId', 'groupId']);
  return result;
};

const getGroupPosts = async (
  groupId: string,
  query: Record<string, unknown>,
) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  }

  const postQuery = new QueryBuilder(
    Post.find({ groupId }).populate(['userId', 'groupId']),
    query,
  )
    .search(postSearchableFields)
    .sort()
    .filter()
    .paginate();

  const result = await postQuery.modelQuery;
  return result;
};

export const PostServices = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
  getMyPosts,
  getLikedPosts,
  createGroupPost,
  getGroupPosts,
};
