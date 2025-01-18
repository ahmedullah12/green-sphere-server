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
exports.PostServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const post_constant_1 = require("./post.constant");
const post_model_1 = require("./post.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const group_model_1 = require("../Group/group.model");
const notification_service_1 = __importDefault(require("../Notification/notification.service"));
const createPost = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.create(payload);
    return result;
});
const getAllPosts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const postQuery = new QueryBuilder_1.default(post_model_1.Post.find().populate('userId'), query)
        .search(post_constant_1.postSearchableFields)
        .sort()
        .filter()
        .paginate();
    const result = yield postQuery.modelQuery;
    return result;
});
const getSinglePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findById(id).populate('userId');
    return result;
});
const updatePost = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deletePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findByIdAndDelete(id);
    return result;
});
const upvotePost = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.Post.findById(postId).populate('userId');
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found');
    }
    const isDownvoted = post.downvotes
        .map((id) => id.toString())
        .includes(userId);
    if (isDownvoted) {
        post.downvotes = post.downvotes.filter((id) => id.toString() !== userId);
        yield notification_service_1.default.deleteNotification({
            recipient: post.userId._id.toString(),
            sender: userId,
            type: 'downvote',
            post: postId,
        });
    }
    else {
        const isUpvoted = post.upvotes.map((id) => id.toString()).includes(userId);
        if (isUpvoted) {
            post.upvotes = post.upvotes.filter((id) => id.toString() !== userId);
            yield notification_service_1.default.deleteNotification({
                recipient: post.userId._id.toString(),
                sender: userId,
                type: 'upvote',
                post: postId,
            });
        }
        else {
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            post.upvotes.push(userObjectId);
            yield notification_service_1.default.createNotification({
                recipient: post.userId._id.toString(),
                sender: userId,
                type: 'upvote',
                post: postId,
            });
        }
    }
    const result = yield post.save();
    return result;
});
const downvotePost = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.Post.findById(postId).populate('userId');
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found');
    }
    const isUpvoted = post.upvotes.map((id) => id.toString()).includes(userId);
    if (isUpvoted) {
        post.upvotes = post.upvotes.filter((id) => id.toString() !== userId);
        yield notification_service_1.default.deleteNotification({
            recipient: post.userId._id.toString(),
            sender: userId,
            type: 'upvote',
            post: postId,
        });
    }
    else {
        const isDownvoted = post.downvotes
            .map((id) => id.toString())
            .includes(userId);
        if (isDownvoted) {
            post.downvotes = post.downvotes.filter((id) => id.toString() !== userId);
            yield notification_service_1.default.deleteNotification({
                recipient: post.userId._id.toString(),
                sender: userId,
                type: 'downvote',
                post: postId,
            });
        }
        else {
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            post.downvotes.push(userObjectId);
            yield notification_service_1.default.createNotification({
                recipient: post.userId._id.toString(),
                sender: userId,
                type: 'downvote',
                post: postId,
            });
        }
    }
    const result = yield post.save();
    return result;
});
const getMyPosts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.find({ userId })
        .sort('-createdAt')
        .populate('userId');
    return result;
});
const getLikedPosts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.find({
        upvotes: { $in: [new mongoose_1.default.Types.ObjectId(userId)] },
    })
        .sort('-createdAt')
        .populate('userId');
    return result;
});
const createGroupPost = (payload, groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield group_model_1.Group.findById(groupId);
    if (!group) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Group not found');
    }
    const post = yield post_model_1.Post.create(Object.assign(Object.assign({}, payload), { groupId }));
    const result = yield post.populate(['userId', 'groupId']);
    return result;
});
const getGroupPosts = (groupId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield group_model_1.Group.findById(groupId);
    if (!group) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Group not found');
    }
    const postQuery = new QueryBuilder_1.default(post_model_1.Post.find({ groupId }).populate(['userId', 'groupId']), query)
        .search(post_constant_1.postSearchableFields)
        .sort()
        .filter()
        .paginate();
    const result = yield postQuery.modelQuery;
    return result;
});
exports.PostServices = {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost,
    upvotePost,
    downvotePost,
    getMyPosts,
    getLikedPosts,
    createGroupPost,
    getGroupPosts,
};
