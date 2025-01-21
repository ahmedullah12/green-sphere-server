import { Router } from 'express';
import { GroupController } from './group.controller';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParser';
import auth from "../../middlewares/auth"

const router = Router();

router.post(
  '/',
  auth("USER", "ADMIN"),
  multerUpload.single('avatar'),
  parseBody,
  GroupController.createGroup,
);
router.get('/', GroupController.getAllGroups);
router.get('/:groupId', GroupController.getSingleGroup);
router.get('/my-groups/:id', GroupController.getMyGroups);
router.post('/:groupId/join', auth("USER", "ADMIN"), GroupController.joinGroup);
router.post('/:groupId/leave', auth("USER", "ADMIN"), GroupController.leaveGroup);
router.put('/:groupId', auth("USER", "ADMIN"), GroupController.updateGroup);
router.delete('/:groupId',auth("USER", "ADMIN"), GroupController.deleteGroup);

export const GroupRoutes = router;
