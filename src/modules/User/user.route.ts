import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.get("/:id", UserController.getUser);
router.put("/update-profile/:id", UserController.updateProfile);
router.put("/follow-user", UserController.followUser);
router.put("/unfollow-user", UserController.unfollowUser);

export const UserRoutes = router;