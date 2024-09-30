import httpStatus from "http-status";
import { TImageFiles } from "../../types/image.type";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PostServices } from "./post.service";

const createPost = catchAsync(async(req, res) => {
    const result = await PostServices.createPost(req.body, req.files as TImageFiles);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Post Created Successfully!!!",
        data: result,
    })
});

const getAllPosts = catchAsync(async(req, res) => {
    const result = await PostServices.getAllPosts();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Posts Fetched Successfully!!!",
        data: result,
    })
});

const getSinglePost = catchAsync(async(req, res) => {
    const {id} = req.params
    const result = await PostServices.getSinglePost(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Post Fetched Successfully!!!",
        data: result,
    })
});

const deletePost = catchAsync(async(req, res) => {
    const {id} = req.params
    const result = await PostServices.deletePost(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Post Deleted Successfully!!!",
        data: result,
    })
});



export const PostController = {
    createPost,
    getAllPosts,
    getSinglePost,
    deletePost
}