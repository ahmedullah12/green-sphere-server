import { Router } from 'express';
import { UserController } from './user.controller';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParser';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/', auth('ADMIN'), UserController.getAllUser);
router.get('/:id', UserController.getUser);
router.put(
  '/update-profile/:id',
  multerUpload.single('image'),
  parseBody,
  UserController.updateProfile,
);
router.delete("/:id", auth("ADMIN"), UserController.deleteUser);
router.put('/follow-user', UserController.followUser);
router.put('/unfollow-user', UserController.unfollowUser);
router.put("/make-admin/:id", auth("ADMIN"), UserController.makeAdmin)

export const UserRoutes = router;
