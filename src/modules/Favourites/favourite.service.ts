import { TFavourite } from "./favourite.interface";
import { Favourite } from "./favourite.model";


const addFavourite = async (payload: TFavourite) => {
  const result = await Favourite.create(payload);

  return result;
};

const getFavourites = async (userId: string) => {
  const result = await Favourite.find({ userId }).populate('postId');

  return result;
};

const removeFavourite = async (id: string) => {
  const result = await Favourite.findByIdAndDelete(id);

  return result;
};

export const FavouriteServices = {
  addFavourite,
  getFavourites,
  removeFavourite,
};
