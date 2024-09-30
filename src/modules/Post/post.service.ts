import { TImageFiles } from "../../types/image.type";
import { TPost } from "./post.interface";
import { Post } from "./post.model";

const createPost = async(payload: TPost, imageFiles: TImageFiles) => {
    const { images } = imageFiles;
    payload.images = images?.map((image) => image.path) || [];

    const result = await Post.create(payload);

    return result;
};

export const PostServices = {
    createPost,
}