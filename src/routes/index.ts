import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';

const router = express.Router();

const moduleRouter = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.route));

export default router;
