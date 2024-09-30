import { TComment } from './comment.interface';
import { Comment } from './comment.model';

const createComment = async (payload: TComment) => {
  const result = await Comment.create(payload);

  return result;
};

const getComments = async (postId: string) => {
  const result = await Comment.find({ postId });

  return result;
};

export const CommentServices = {
  createComment,
  getComments,
};
