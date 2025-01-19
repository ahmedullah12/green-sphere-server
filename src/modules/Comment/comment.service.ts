import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import NotificationService from '../Notification/notification.service';
import { Post } from '../Post/post.model';
import { TComment } from './comment.interface';
import { Comment } from './comment.model';

const createComment = async (payload: TComment) => {
  const commentedPost = await Post.findById(payload.postId);

  if (!commentedPost) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found!!!');
  }

  const result = await Comment.create(payload);

  await NotificationService.createNotification({
    recipient: commentedPost.userId.toString(),
    sender: payload.userId.toString(),
    type: 'comment',
    post: payload.postId.toString(),
    comment: result._id.toString(),
  });

  return result;
};

const getComments = async (postId: string) => {
  const result = await Comment.find({ postId }).populate('userId');

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
  const comment = await Comment.findById(id);
  
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  // Delete notification for this comment
  await NotificationService.deleteNotification({
    comment: id.toString(),
    type: 'comment'
  });

  const result = await Comment.findByIdAndDelete(id);
  return result;
};

export const CommentServices = {
  createComment,
  getComments,
  updateComments,
  deleteComments,
};
