import { Router } from "express";
import { USER_ROLE } from "../User/user.constant";
import auth from "../../middlewares/auth";
import { NotificationController } from "./notification.controller";

const router = Router();

router.get("/", auth(USER_ROLE.ADMIN, USER_ROLE.USER), NotificationController.getNotifications);

export const NotificationRoutes = router;