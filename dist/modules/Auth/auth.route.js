"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
router.post('/register', multer_config_1.multerUpload.single("image"), 
// validateRequest(AuthValidations.registerValidationSchema),
auth_controller_1.AuthController.registerUser);
router.post('/login', (0, validateRequest_1.validateRequest)(auth_validation_1.AuthValidations.loginValidationSchema), auth_controller_1.AuthController.loginUser);
exports.AuthRoutes = router;
