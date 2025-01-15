"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = require("../../middlewares/validateRequest");
const comment_validations_1 = require("./comment.validations");
const comment_controller_1 = require("./comment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)("USER", "ADMIN"), (0, validateRequest_1.validateRequest)(comment_validations_1.CommentValidations.createCommentValidationSchema), comment_controller_1.CommentController.createComment);
router.get('/:id', comment_controller_1.CommentController.getComments);
router.put('/:id', (0, validateRequest_1.validateRequest)(comment_validations_1.CommentValidations.updateCommentValidationSchema), comment_controller_1.CommentController.updateComments);
router.delete('/:id', comment_controller_1.CommentController.deleteComments);
exports.CommentRoutes = router;
