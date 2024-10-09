import { model, Schema } from 'mongoose';
import { TFavourite } from './favourite.interface';

const favouriteSchema = new Schema<TFavourite>({
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post',
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

export const Favourite = model('Favourite', favouriteSchema);
