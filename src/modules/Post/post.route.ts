import { Router } from 'express';
import { PostController } from './post.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { PostValidations } from './post.validations';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParser';

const router = Router();

router.post(
  '/create-post',
  multerUpload.single("image"),
  parseBody,
  validateRequest(PostValidations.createPostValidationSchema),
  PostController.createPost,
);
router.get("/", PostController.getAllPosts);
router.get("/:id", PostController.getSinglePost);
router.get("/my-posts/:userId", PostController.getMyPosts);
router.put("/:id", PostController.updatePost);
router.delete("/:id", PostController.deletePost);
router.put("/action/upvote-post", PostController.upvotePost);
router.put("/action/downvote-post", PostController.downvotePost);


export const PostRoutes = router;
