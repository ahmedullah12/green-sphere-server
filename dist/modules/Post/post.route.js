"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoutes = void 0;
const express_1 = require("express");
const post_controller_1 = require("./post.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const post_validations_1 = require("./post.validations");
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = (0, express_1.Router)();
router.post('/create-post', multer_config_1.multerUpload.single('image'), bodyParser_1.parseBody, (0, validateRequest_1.validateRequest)(post_validations_1.PostValidations.createPostValidationSchema), post_controller_1.PostController.createPost);
router.get('/', post_controller_1.PostController.getAllPosts);
router.post('/:groupId/posts', multer_config_1.multerUpload.single('image'), bodyParser_1.parseBody, post_controller_1.PostController.createGroupPost);
router.get('/:groupId/posts', post_controller_1.PostController.getGroupPosts);
router.get('/:id', post_controller_1.PostController.getSinglePost);
router.get('/my-posts/:userId', post_controller_1.PostController.getMyPosts);
router.get('/liked-posts/:userId', post_controller_1.PostController.getLikedPosts);
router.put('/:id', post_controller_1.PostController.updatePost);
router.delete('/:id', post_controller_1.PostController.deletePost);
router.put('/action/upvote-post', post_controller_1.PostController.upvotePost);
router.put('/action/downvote-post', post_controller_1.PostController.downvotePost);
exports.PostRoutes = router;
