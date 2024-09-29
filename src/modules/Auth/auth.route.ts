import express from "express"
import { AuthValidations } from "./auth.validation";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";


const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidations.registerValidationSchema),
  AuthController.registerUser
);
router.post(
  '/login',
  validateRequest(AuthValidations.loginValidationSchema),
  AuthController.loginUser
);

export const AuthRoutes = router;