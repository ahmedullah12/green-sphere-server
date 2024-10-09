import { Router } from 'express';
import { UserController } from './user.controller';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParser';

const router = Router();

router.get('/:id', UserController.getUser);
router.put(
  '/update-profile/:id',
  multerUpload.single('image'),
  parseBody,
  UserController.updateProfile,
);
router.put('/follow-user', UserController.followUser);
router.put('/unfollow-user', UserController.unfollowUser);

export const UserRoutes = router;
