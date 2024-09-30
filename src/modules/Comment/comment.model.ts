import { model, Schema } from "mongoose";
import { TComment } from "./comment.interface";

const commentSchema = new Schema<TComment>({
    postId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Post"
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    comment: {
        type: String,
        required: true,
    }
});

export const Comment = model("Comment", commentSchema)