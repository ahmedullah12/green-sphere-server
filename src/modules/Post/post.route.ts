import { Router } from 'express';
import { PostController } from './post.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { PostValidations } from './post.validations';
import { validateImageFileRequest } from '../../middlewares/validateImageFileRequest';
import { ImageFilesArrayZodSchema } from '../../zod/image.validation';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParser';

const router = Router();

router.post(
  '/create-post',
  multerUpload.fields([{ name: 'images' }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(PostValidations.createPostValidationSchema),
  PostController.createPost,
);

export const PostRoutes = router;
