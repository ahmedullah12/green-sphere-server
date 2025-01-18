"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const notification_model_1 = require("./notification.model");
const server_1 = require("../../server");
const NotificationService = {
    createNotification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield notification_model_1.Notification.create(data);
            yield notification.populate(['recipient', 'sender', 'post']);
            // Emit to specific recipient
            server_1.io.to(data.recipient).emit('notification', notification);
            return notification;
        });
    },
    deleteNotification(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield notification_model_1.Notification.findOneAndDelete(query);
            if (notification) {
                server_1.io.to(query.recipient).emit('deleteNotification', notification._id);
            }
            return notification;
        });
    },
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield notification_model_1.Notification.find({
                recipient: userId
            })
                .sort({ createdAt: -1 }) // Sort by newest first
                .populate(['recipient', 'sender', 'post']);
            return notifications;
        });
    }
};
exports.default = NotificationService;
