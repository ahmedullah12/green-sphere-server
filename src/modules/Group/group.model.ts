import { model, Schema } from "mongoose";
import { TGroup } from "./group.interface";

const groupSchema = new Schema<TGroup>(
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }],
      avatar: {
        type: String,
        default: '',
      },
      rules: {
        type: [String],
        default: [],
      },
    },
    {
      timestamps: true,
    },
  );
  
  export const Group = model('Group', groupSchema);