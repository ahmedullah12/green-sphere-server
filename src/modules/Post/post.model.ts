import { Schema, model, Types } from 'mongoose';
import { POST_CATEGORY, POST_TAG } from './post.constant';
import { TPost } from './post.interface';

const postSchema = new Schema<TPost>(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    category: {
      type: [String],
      enum: Object.keys(POST_CATEGORY),
      required: true,
    },
    tag: {
      type: String,
      enum: Object.keys(POST_TAG),
      required: true,
    },
    upvotes: {
      type: [Types.ObjectId],
      ref: 'User',
      default: [],
    },
    downvotes: {
      type: [Types.ObjectId],
      ref: 'User',
      default: [],
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    }
  },
  {
    timestamps: true,
  },
);

export const Post = model('Post', postSchema);
