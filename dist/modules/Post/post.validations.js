"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidations = void 0;
const zod_1 = require("zod");
const post_constant_1 = require("./post.constant");
const createPostValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Title is required',
        }),
        description: zod_1.z.string(),
        userId: zod_1.z.string(),
        category: zod_1.z.array(zod_1.z.enum(Object.keys(post_constant_1.POST_CATEGORY)), { required_error: 'Category is required' }),
        tag: zod_1.z.enum(Object.keys(post_constant_1.POST_TAG), {
            required_error: 'Tag is required',
        }),
    }),
});
const updatePostValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: 'Title is required',
        })
            .optional(),
        description: zod_1.z.string().optional(),
        userId: zod_1.z.string().optional(),
        category: zod_1.z
            .array(zod_1.z
            .enum(Object.keys(post_constant_1.POST_CATEGORY))
            .optional(), { required_error: 'Category is required' })
            .optional(),
        tag: zod_1.z
            .enum(Object.keys(post_constant_1.POST_TAG), {
            required_error: 'Tag is required',
        })
            .optional(),
    }),
});
exports.PostValidations = {
    createPostValidationSchema,
    updatePostValidationSchema,
};
