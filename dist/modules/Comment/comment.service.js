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
exports.CommentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const notification_service_1 = __importDefault(require("../Notification/notification.service"));
const post_model_1 = require("../Post/post.model");
const comment_model_1 = require("./comment.model");
const createComment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const commentedPost = yield post_model_1.Post.findById(payload.postId);
    if (!commentedPost) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!!!');
    }
    const result = yield comment_model_1.Comment.create(payload);
    yield notification_service_1.default.createNotification({
        recipient: commentedPost.userId.toString(),
        sender: payload.userId.toString(),
        type: 'comment',
        post: payload.postId.toString(),
        comment: result._id.toString(),
    });
    return result;
});
const getComments = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_model_1.Comment.find({ postId }).populate('userId');
    return result;
});
const updateComments = (commentId, comment) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_model_1.Comment.findByIdAndUpdate(commentId, comment, {
        new: true,
    });
    return result;
});
const deleteComments = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.Comment.findById(id).populate('postId');
    if (!comment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Comment not found');
    }
    const commentedPost = yield post_model_1.Post.findById(comment.postId);
    if (!commentedPost) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found');
    }
    // Delete notification for this comment
    yield notification_service_1.default.deleteNotification({
        recipient: commentedPost.userId.toString(),
        sender: comment.userId.toString(),
        comment: id.toString(),
        type: 'comment',
    });
    const result = yield comment_model_1.Comment.findByIdAndDelete(id);
    return result;
});
exports.CommentServices = {
    createComment,
    getComments,
    updateComments,
    deleteComments,
};
