import { TImageFiles } from '../../types/image.type';
import { TPost } from './post.interface';
import { Post } from './post.model';

const createPost = async (payload: TPost, imageFiles: TImageFiles) => {
  const { images } = imageFiles;
  payload.images = images?.map((image) => image.path) || [];

  const result = await Post.create(payload);

  return result;
};

const getAllPosts = async () => {
  const result = await Post.find();

  return result;
};

const getSinglePost = async (id: string) => {
  const result = await Post.findById(id);

  return result;
};

const deletePost = async (id: string) => {
  const result = await Post.findByIdAndDelete(id);

  return result;
};

export const PostServices = {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
};
