import { TComment } from './comment.interface';
import { Comment } from './comment.model';

const createComment = async (payload: TComment) => {
  const result = await Comment.create(payload);

  return result;
};

const getComments = async (postId: string) => {
  const result = await Comment.find({ postId }).populate("userId");

  return result;
};

const updateComments = async (
  commentId: string,
  comment: Partial<TComment>,
) => {
  const result = await Comment.findByIdAndUpdate(commentId, comment, {
    new: true,
  });

  return result;
};

const deleteComments = async(id: string) => {
    const result = await Comment.findByIdAndDelete(id);

    return result;
}

export const CommentServices = {
  createComment,
  getComments,
  updateComments,
  deleteComments,
};
