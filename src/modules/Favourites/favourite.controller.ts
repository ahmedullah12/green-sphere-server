import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FavouriteServices } from './favourite.service';

const addFavourite = catchAsync(async (req, res) => {
  const result = await FavouriteServices.addFavourite(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Favourite Added Successfully!!!',
    data: result,
  });
});

const getFavourites = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FavouriteServices.getFavourites(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Favourites Fetched Successfully!!!',
    data: result,
  });
});

const removeFavourite = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FavouriteServices.removeFavourite(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments Deleted Successfully!!!',
    data: result,
  });
});

export const FavouriteController = {
  addFavourite,
  getFavourites,
  removeFavourite,
};
