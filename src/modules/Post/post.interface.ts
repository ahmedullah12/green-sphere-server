import { Types } from 'mongoose';
import { POST_CATEGORY, POST_TAG } from './post.constant';

export type TPost = {
  title: string;
  image: string;
  description: string;
  userId: Types.ObjectId;
  category: (keyof typeof POST_CATEGORY)[];
  tag: keyof typeof POST_TAG;
  groupId?: Types.ObjectId;
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
};
