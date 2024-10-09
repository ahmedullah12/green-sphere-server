import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { PostRoutes } from '../modules/Post/post.route';
import { CommentRoutes } from '../modules/Comment/comment.route';
import { PaymentCollectionRoutes } from '../modules/PaymentsCollection/payment-collection.route';
import { PaymentRoutes } from '../modules/Payment/payment.route';
import { FavouriteRoutes } from '../modules/Favourites/favourite.route';

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
    path: '/favourite',
    route: FavouriteRoutes,
  },
  {
    path: '/comments',
    route: CommentRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes
  },
  {
    path: '/payment-collection',
    route: PaymentCollectionRoutes,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.route));

export default router;
