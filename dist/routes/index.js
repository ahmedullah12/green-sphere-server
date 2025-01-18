"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/Auth/auth.route");
const user_route_1 = require("../modules/User/user.route");
const post_route_1 = require("../modules/Post/post.route");
const comment_route_1 = require("../modules/Comment/comment.route");
const payment_collection_route_1 = require("../modules/PaymentsCollection/payment-collection.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const favourite_route_1 = require("../modules/Favourites/favourite.route");
const group_route_1 = require("../modules/Group/group.route");
const overview_data_route_1 = require("../modules/OverviewData/overview-data.route");
const notification_route_1 = require("../modules/Notification/notification.route");
const router = express_1.default.Router();
const moduleRouter = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/user',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/posts',
        route: post_route_1.PostRoutes,
    },
    {
        path: '/favourite',
        route: favourite_route_1.FavouriteRoutes,
    },
    {
        path: '/comments',
        route: comment_route_1.CommentRoutes,
    },
    {
        path: '/payment',
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: '/payment-collection',
        route: payment_collection_route_1.PaymentCollectionRoutes,
    },
    {
        path: '/groups',
        route: group_route_1.GroupRoutes,
    },
    {
        path: '/overview',
        route: overview_data_route_1.OverviewRoutes,
    },
    {
        path: '/notifications',
        route: notification_route_1.NotificationRoutes,
    },
];
moduleRouter.forEach((route) => router.use(route.path, route.route));
exports.default = router;
