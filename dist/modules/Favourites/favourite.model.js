"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Favourite = void 0;
const mongoose_1 = require("mongoose");
const favouriteSchema = new mongoose_1.Schema({
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Post',
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
});
exports.Favourite = (0, mongoose_1.model)('Favourite', favouriteSchema);
