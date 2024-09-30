import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { PostRoutes } from '../modules/Post/post.route';
import { CommentRoutes } from '../modules/Comment/comment.route';

const router = express.Router();

const moduleRouter = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/posts',
    route: PostRoutes,
  },
  {
    path: '/comments',
    route: CommentRoutes,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.route));

export default router;
