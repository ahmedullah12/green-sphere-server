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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("./user.model");
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id)
        .populate('followers')
        .populate('following');
    return result;
});
const updateProfile = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const followUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, followedUserId } = payload;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //update the followed user
        yield user_model_1.User.findByIdAndUpdate(followedUserId, { $addToSet: { followers: userId } }, { new: true, session });
        // Update the user
        const result = yield user_model_1.User.findByIdAndUpdate(userId, { $addToSet: { following: followedUserId } }, { new: true, session });
        // Commit the transaction
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error);
    }
});
const unfollowUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, followedUserId } = payload;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Update the followedUser by removing userId from followers array
        yield user_model_1.User.findByIdAndUpdate(followedUserId, { $pull: { followers: userId } }, { new: true, session });
        // Update the user by removing followedUserId from following array
        const result = yield user_model_1.User.findByIdAndUpdate(userId, { $pull: { following: followedUserId } }, { new: true, session });
        // Commit the transaction
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (error) {
        // Abort the transaction if any error occurs
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error);
    }
});
exports.UserService = {
    getUser,
    updateProfile,
    followUser,
    unfollowUser,
};
