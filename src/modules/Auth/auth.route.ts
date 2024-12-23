import express from 'express';
import { AuthValidations } from './auth.validation';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { multerUpload } from '../../config/multer.config';
import { ImageFileZodSchema } from '../../zod/image.validation';
import { parseBody } from '../../middlewares/bodyParser';
import { validateSingleImageFileRequest } from '../../middlewares/validateImageFileRequest';

const router = express.Router();

router.post(
  '/register',
  multerUpload.single('image'),
  validateSingleImageFileRequest(ImageFileZodSchema),
  parseBody,
  validateRequest(AuthValidations.registerValidationSchema),
  AuthController.registerUser,
);
router.post(
  '/login',
  validateRequest(AuthValidations.loginValidationSchema),
  AuthController.loginUser,
);

router.get(
  '/google/login',
  AuthController.googleLogin
);

router.get(
  '/google/callback',
  AuthController.googleCallback,
);

router.post('/refresh-token', AuthController.refreshToken);

router.put(
  '/change-password/:userId',
  validateRequest(AuthValidations.changePasswordValidationSchema),
  AuthController.changePassword,
);
router.post(
  '/forget-password',
  validateRequest(AuthValidations.forgetPasswordValidationSchema),
  AuthController.forgetPassword,
);

router.post(
  '/reset-password',
  validateRequest(AuthValidations.forgetPasswordValidationSchema),
  AuthController.resetPassword,
);

export const AuthRoutes = router;
