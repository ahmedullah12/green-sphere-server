import { z } from "zod";


const createCommentValidationSchema = z.object({
    body: z.object({
        postId: z.string(),
        userId: z.string(),
        comment: z.string(),
    })
})
const updateCommentValidationSchema = z.object({
    body: z.object({
        postId: z.string().optional(),
        userId: z.string().optional(),
        comment: z.string().optional(),
    })
});

export const CommentValidations = {
    createCommentValidationSchema,
    updateCommentValidationSchema
}