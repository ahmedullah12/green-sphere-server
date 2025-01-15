"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidations = void 0;
const zod_1 = require("zod");
const createCommentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        postId: zod_1.z.string(),
        userId: zod_1.z.string(),
        comment: zod_1.z.string(),
    })
});
const updateCommentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        postId: zod_1.z.string().optional(),
        userId: zod_1.z.string().optional(),
        comment: zod_1.z.string().optional(),
    })
});
exports.CommentValidations = {
    createCommentValidationSchema,
    updateCommentValidationSchema
};
