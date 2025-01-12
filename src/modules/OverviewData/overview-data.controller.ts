import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { OverviewServices } from "./overview-data.service";
import sendResponse from "../../utils/sendResponse";

const getAdminOverviewData = catchAsync(async (req, res) => {
  const result = await OverviewServices.getAdminOverviewData();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All data fetched successfully!!",
    data: result,
  });
});



export const OverviewController = {
  getAdminOverviewData,
};
