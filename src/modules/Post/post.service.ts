import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TImageFiles } from '../../types/image.type';
import { postSearchableFields } from './post.constant';
import { TPost } from './post.interface';
import { Post } from './post.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createPost = async (payload: TPost, imageFiles: TImageFiles) => {
  const { images } = imageFiles;
  payload.images = images?.map((image) => image.path) || [];

  const result = await Post.create(payload);

  return result;
};

const getAllPosts = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Post.find(), query)
    .search(postSearchableFields)
    .sort()
    .filter();
  const result = await postQuery.modelQuery;

  return result;
};

const getSinglePost = async (id: string) => {
  const result = await Post.findById(id);

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

const upvotePost = async (postId: string, userId: string) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const isDownvoted = post.downvotes
    .map((id) => id.toString())
    .includes(userId);

  if (isDownvoted) {
    post.downvotes = post.downvotes.filter((id) => id.toString() !== userId);
  } else {
    const isUpvoted = post.upvotes.map((id) => id.toString()).includes(userId);

    if (isUpvoted) {
      post.upvotes = post.upvotes.filter((id) => id.toString() !== userId);
    } else {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      post.upvotes.push(userObjectId);
    }
  }

  const result = await post.save();

  return result;
};

const downvotePost = async (postId: string, userId: string) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new Error('Post not found');
  }

  const isUpvoted = post.upvotes.map((id) => id.toString()).includes(userId);
  if (isUpvoted) {
    post.upvotes = post.upvotes.filter((id) => id.toString() !== userId);
  } else {
    const isDownvoted = post.downvotes
      .map((id) => id.toString())
      .includes(userId);

    if (isDownvoted) {
      post.downvotes = post.downvotes.filter((id) => id.toString() !== userId);
    } else {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      post.downvotes.push(userObjectId);
    }
  }

  await post.save();

  return post;
};

export const PostServices = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
};
