import { z } from 'zod';
import { POST_CATEGORY, POST_TAG } from './post.constant';

const createPostValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    description: z.string(),
    userId: z.string(),
    category: z.array(
      z.enum(Object.keys(POST_CATEGORY) as [keyof typeof POST_CATEGORY]),
      { required_error: 'Category is required' },
    ),
    tag: z.enum(Object.keys(POST_TAG) as [keyof typeof POST_TAG], {
      required_error: 'Tag is required',
    }),
  }),
});

const updatePostValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
      })
      .optional(),
    description: z.string().optional(),
    userId: z.string().optional(),
    category: z
      .array(
        z
          .enum(Object.keys(POST_CATEGORY) as [keyof typeof POST_CATEGORY])
          .optional(),
        { required_error: 'Category is required' },
      )
      .optional(),
    tag: z
      .enum(Object.keys(POST_TAG) as [keyof typeof POST_TAG], {
        required_error: 'Tag is required',
      })
      .optional(),
  }),
});

export const PostValidations = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
