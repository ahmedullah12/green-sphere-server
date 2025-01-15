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
exports.CommentServices = void 0;
const comment_model_1 = require("./comment.model");
const createComment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_model_1.Comment.create(payload);
    return result;
});
const getComments = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_model_1.Comment.find({ postId }).populate("userId");
    return result;
});
const updateComments = (commentId, comment) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_model_1.Comment.findByIdAndUpdate(commentId, comment, {
        new: true,
    });
    return result;
});
const deleteComments = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_model_1.Comment.findByIdAndDelete(id);
    return result;
});
exports.CommentServices = {
    createComment,
    getComments,
    updateComments,
    deleteComments,
};
