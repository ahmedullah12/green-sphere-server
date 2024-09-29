import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();


router.put("/follow-user", UserController.followUser);
router.put("/unfollow-user", UserController.unfollowUser);

export const UserRoutes = router;