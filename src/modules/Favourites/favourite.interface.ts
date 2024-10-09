import { Types } from 'mongoose';

export type TFavourite = {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
};
