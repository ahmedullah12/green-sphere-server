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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../../utils/sendEmail");
const google_auth_library_1 = require("google-auth-library");
const user_constant_1 = require("../User/user.constant");
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
    if (user.provider === 'google' || !user.password) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Please login with different provider');
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
const dataobj = {
    clientId: config_1.default.google_client_id,
    clientSecret: config_1.default.google_client_secret,
    redirectUri: `${config_1.default.server_url}/api/auth/google/callback`,
};
const oauth2Client = new google_auth_library_1.OAuth2Client(dataobj);
// Generate Google OAuth URL
const getGoogleAuthURL = () => {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ];
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true,
    });
};
const googleCallback = (code) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Exchange code for tokens
        const { tokens } = yield oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        // Get user info from Google
        const userInfoClient = oauth2Client.request({
            url: 'https://www.googleapis.com/oauth2/v3/userinfo',
        });
        const { data } = (yield userInfoClient);
        // Check if user exists
        let user = yield user_model_1.User.isUserExistsByEmail(data.email);
        if (!user) {
            // Create new user if doesn't exist
            user = yield user_model_1.User.create({
                name: data.name,
                email: data.email,
                profilePhoto: data.picture,
                provider: 'google',
                role: user_constant_1.USER_ROLE.USER,
            });
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
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, error.message);
    }
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.refresh_token_secret);
    const { email, iat } = decoded;
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByEmail(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found!');
    }
    const jwtPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role,
    };
    const accessToken = (0, verifyJwt_1.createToken)(jwtPayload, config_1.default.access_token_secret, config_1.default.access_token_expires_in);
    return {
        accessToken,
    };
});
const changePassword = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    //checking if the password is correct
    if (!(yield user_model_1.User.isPasswordMatched(payload.oldPassword, user === null || user === void 0 ? void 0 : user.password)))
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Old password do not matched');
    //hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    yield user_model_1.User.findByIdAndUpdate(user._id, {
        password: newHashedPassword,
    });
    return null;
});
const forgetPassword = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByEmail(userEmail);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    const jwtPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role,
    };
    const resetToken = (0, verifyJwt_1.createToken)(jwtPayload, config_1.default.access_token_secret, '10m');
    const resetUILink = `${config_1.default.reset_pass_ui_link}?id=${user._id}&token=${resetToken} `;
    yield (0, sendEmail_1.sendEmail)(user.email, resetUILink);
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByEmail(payload === null || payload === void 0 ? void 0 : payload.email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.access_token_secret);
    if (payload.email !== decoded.email) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are forbidden!');
    }
    //hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    yield user_model_1.User.findOneAndUpdate({
        email: decoded.email,
        role: decoded.role,
    }, {
        password: newHashedPassword,
    });
});
exports.AuthServices = {
    registerUser,
    loginUser,
    getGoogleAuthURL,
    googleCallback,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword,
};
