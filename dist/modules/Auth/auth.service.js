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
exports.AuthServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const verifyJwt_1 = require("../../utils/verifyJwt");
const user_model_1 = require("../User/user.model");
const config_1 = __importDefault(require("../../config"));
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user already exists
    const user = yield user_model_1.User.isUserExistsByEmail(payload === null || payload === void 0 ? void 0 : payload.email);
    if (user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is already exist!');
    }
    const newUser = yield user_model_1.User.create(payload);
    const jwtPayload = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePhoto: newUser.profilePhoto,
        role: newUser.role,
    };
    const refreshToken = (0, verifyJwt_1.createToken)(jwtPayload, config_1.default.refresh_token_secret, config_1.default.refresh_token_expires_in);
    const accessToken = (0, verifyJwt_1.createToken)(jwtPayload, config_1.default.access_token_secret, config_1.default.access_token_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByEmail(payload === null || payload === void 0 ? void 0 : payload.email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found!');
    }
    //checking if the password is correct
    const isPasswordMatched = yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password do not matched');
    }
    const jwtPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role,
    };
    const refreshToken = (0, verifyJwt_1.createToken)(jwtPayload, config_1.default.refresh_token_secret, config_1.default.refresh_token_expires_in);
    const accessToken = (0, verifyJwt_1.createToken)(jwtPayload, config_1.default.access_token_secret, config_1.default.access_token_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
exports.AuthServices = {
    registerUser,
    loginUser,
};
