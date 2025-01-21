"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupRoutes = void 0;
const express_1 = require("express");
const group_controller_1 = require("./group.controller");
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)("USER", "ADMIN"), multer_config_1.multerUpload.single('avatar'), bodyParser_1.parseBody, group_controller_1.GroupController.createGroup);
router.get('/', group_controller_1.GroupController.getAllGroups);
router.get('/:groupId', group_controller_1.GroupController.getSingleGroup);
router.get('/my-groups/:id', group_controller_1.GroupController.getMyGroups);
router.post('/:groupId/join', (0, auth_1.default)("USER", "ADMIN"), group_controller_1.GroupController.joinGroup);
router.post('/:groupId/leave', (0, auth_1.default)("USER", "ADMIN"), group_controller_1.GroupController.leaveGroup);
router.put('/:groupId', (0, auth_1.default)("USER", "ADMIN"), group_controller_1.GroupController.updateGroup);
router.delete('/:groupId', (0, auth_1.default)("USER", "ADMIN"), group_controller_1.GroupController.deleteGroup);
exports.GroupRoutes = router;
