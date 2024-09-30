import QueryBuilder from "../../builder/QueryBuilder";
import { TImageFiles } from "../../types/image.type";
import { postSearchableFields } from "./post.constant";
import { TPost } from "./post.interface";
import { Post } from "./post.model";

const createPost = async(payload: TPost, imageFiles: TImageFiles) => {
    const { images } = imageFiles;
    payload.images = images?.map((image) => image.path) || [];

    const result = await Post.create(payload);

    return result;
};

const getAllPosts = async(query: Record<string, unknown>) => {
    const postQuery = new QueryBuilder(Post.find(), query).search(postSearchableFields);
    const result = await postQuery.modelQuery;

    return result;
}

const getSinglePost = async(id: string) => {
    const result = await Post.findById(id);

    return result;
};

const deletePost = async(id: string) => {
    const result = await Post.findByIdAndDelete(id);

    return result;
}



export const PostServices = {
    createPost,
    getAllPosts,
    getSinglePost,
    deletePost
}