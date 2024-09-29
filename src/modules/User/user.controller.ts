import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";



const followUser = catchAsync(async(req, res) => {
    const result = await UserService.followUser(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Followed Successfully!!!",
        data: [],
    })

});
const unfollowUser = catchAsync(async(req, res) => {
    const result = await UserService.unfollowUser(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Unfollowed Successfully!!!",
        data: [],
    })

});

export const UserController = {
    followUser,
    unfollowUser
}