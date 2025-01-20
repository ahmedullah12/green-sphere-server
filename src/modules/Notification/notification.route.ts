import { Router } from 'express';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../middlewares/auth';
import { NotificationController } from './notification.controller';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  NotificationController.getNotifications,
);
router.patch(
  '/mark-all-read',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  NotificationController.markAllAsRead,
);

export const NotificationRoutes = router;
