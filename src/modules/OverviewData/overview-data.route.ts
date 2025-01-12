import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { OverviewController } from './overview-data.controller';

const router = Router();

router.get('/', auth(USER_ROLE.ADMIN), OverviewController.getAdminOverviewData);


export const OverviewRoutes = router;
