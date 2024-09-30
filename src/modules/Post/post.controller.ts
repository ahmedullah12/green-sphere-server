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

export const PostController = {
    createPost,
}