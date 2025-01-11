import { Router } from 'express';
import { GroupController } from './group.controller';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParser';

const router = Router();

router.post(
  '/',
  multerUpload.single('avatar'),
  parseBody,
  GroupController.createGroup,
);
router.get('/', GroupController.getAllGroups);
router.get('/my-groups', GroupController.getMyGroups);
router.get('/:groupId', GroupController.getSingleGroup);
router.post('/:groupId/join', GroupController.joinGroup);
router.post('/:groupId/leave', GroupController.leaveGroup);
router.put('/:groupId', GroupController.updateGroup);
router.delete('/:groupId', GroupController.deleteGroup);

export const GroupRoutes = router;
