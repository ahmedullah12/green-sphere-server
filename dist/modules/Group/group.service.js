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
exports.GroupServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const mongoose_1 = __importDefault(require("mongoose"));
const group_model_1 = require("./group.model");
const post_model_1 = require("../Post/post.model");
const createGroup = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield group_model_1.Group.create(Object.assign(Object.assign({}, payload), { members: [payload.creator] }));
    return result;
});
const getAllGroups = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const groupQuery = new QueryBuilder_1.default(group_model_1.Group.find().populate('creator members', 'name profilePhoto'), query)
        .search(['name', 'description'])
        .sort()
        .filter()
        .paginate();
    const result = yield groupQuery.modelQuery;
    return result;
});
const getSingleGroup = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield group_model_1.Group.findById(groupId).populate('creator members', 'name profilePhoto');
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Group not found');
    }
    return result;
});
const joinGroup = (groupId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield group_model_1.Group.findById(groupId);
    if (!group) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Group not found');
    }
    const isMember = group.members.map((id) => id.toString()).includes(userId);
    if (isMember) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Already a member');
    }
    group.members.push(new mongoose_1.default.Types.ObjectId(userId));
    const result = yield group.save();
    return result;
});
const leaveGroup = (groupId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield group_model_1.Group.findById(groupId);
    if (!group) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Group not found');
    }
    if (group.creator.toString() === userId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Group creator cannot leave');
    }
    group.members = group.members.filter((id) => id.toString() !== userId);
    const result = yield group.save();
    return result;
});
const updateGroup = (groupId, payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield group_model_1.Group.findById(groupId);
    if (!group) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Group not found');
    }
    if (group.creator.toString() !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Only creator can update group');
    }
    const result = yield group_model_1.Group.findByIdAndUpdate(groupId, payload, {
        new: true,
    }).populate('creator members', 'name profilePhoto');
    return result;
});
const deleteGroup = (groupId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield group_model_1.Group.findById(groupId);
    if (!group) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Group not found');
    }
    if (group.creator.toString() !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Only creator can delete group');
    }
    // Delete posts of the group
    yield post_model_1.Post.deleteMany({ groupId });
    const result = yield group_model_1.Group.findByIdAndDelete(groupId);
    return result;
});
const getMyGroups = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield group_model_1.Group.find({
        members: { $in: [new mongoose_1.default.Types.ObjectId(userId)] },
    }).sort('-createdAt');
    return result;
});
exports.GroupServices = {
    createGroup,
    getAllGroups,
    joinGroup,
    leaveGroup,
    updateGroup,
    deleteGroup,
    getMyGroups,
    getSingleGroup,
};
