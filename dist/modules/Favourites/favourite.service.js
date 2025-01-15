"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavouriteServices = void 0;
const favourite_model_1 = require("./favourite.model");
const addFavourite = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favourite_model_1.Favourite.create(payload);
    return result;
});
const getFavourites = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favourite_model_1.Favourite.find({ userId })
        .populate({
        path: 'postId',
        populate: {
            path: 'userId',
        },
    });
    return result;
});
const removeFavourite = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favourite_model_1.Favourite.findByIdAndDelete(id);
    return result;
});
exports.FavouriteServices = {
    addFavourite,
    getFavourites,
    removeFavourite,
};
