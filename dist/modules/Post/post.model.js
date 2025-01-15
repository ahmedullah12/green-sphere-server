"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const post_constant_1 = require("./post.constant");
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    category: {
        type: [String],
        enum: Object.keys(post_constant_1.POST_CATEGORY),
        required: true,
    },
    tag: {
        type: String,
        enum: Object.keys(post_constant_1.POST_TAG),
        required: true,
    },
    upvotes: {
        type: [mongoose_1.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    downvotes: {
        type: [mongoose_1.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    groupId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Group",
        default: null,
    }
}, {
    timestamps: true,
});
exports.Post = (0, mongoose_1.model)('Post', postSchema);
