"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    recipient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['upvote', 'downvote', 'follow', 'unfollow', 'comment'],
        required: true,
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Post',
        required: function () {
            return ['upvote', 'downvote', 'comment'].includes(this.type);
        },
    },
    comment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comment',
        required: function () {
            return this.type === 'comment';
        },
    },
    read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Notification = (0, mongoose_1.model)('Notification', notificationSchema);
