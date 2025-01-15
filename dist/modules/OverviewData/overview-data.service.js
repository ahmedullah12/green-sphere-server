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
exports.OverviewServices = void 0;
const group_model_1 = require("../Group/group.model");
const payment_collection_model_1 = require("../PaymentsCollection/payment-collection.model");
const post_model_1 = require("../Post/post.model");
const user_model_1 = require("../User/user.model");
const getAdminOverviewData = () => __awaiter(void 0, void 0, void 0, function* () {
    const userCounts = yield user_model_1.User.countDocuments();
    const postsCounts = yield post_model_1.Post.countDocuments();
    const groupCounts = yield group_model_1.Group.countDocuments();
    const paymentCounts = yield payment_collection_model_1.Payment.countDocuments();
    const recentPosts = yield post_model_1.Post.find({}).sort({ createdAt: -1 }).limit(5);
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    const postsAggregation = yield post_model_1.Post.aggregate([
        {
            $match: {
                createdAt: { $gte: twelveMonthsAgo },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                '_id.year': 1,
                '_id.month': 1,
            },
        },
    ]);
    const paymentsAggregation = yield payment_collection_model_1.Payment.aggregate([
        {
            $match: {
                createdAt: { $gte: twelveMonthsAgo },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                '_id.year': 1,
                '_id.month': 1,
            },
        },
    ]);
    const months = Array(12)
        .fill(null)
        .map((_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return {
            month: date.toLocaleString('default', { month: 'short' }),
            year: date.getFullYear(),
            monthIndex: date.getMonth() + 1,
        };
    });
    const postsChartData = months.map(({ month, year, monthIndex }) => {
        const postsData = postsAggregation.find((item) => item._id.year === year && item._id.month === monthIndex);
        return {
            month,
            count: (postsData === null || postsData === void 0 ? void 0 : postsData.count) || 0,
        };
    });
    const paymentsChartData = months.map(({ month, year, monthIndex }) => {
        const paymentsData = paymentsAggregation.find((item) => item._id.year === year && item._id.month === monthIndex);
        return {
            month,
            count: (paymentsData === null || paymentsData === void 0 ? void 0 : paymentsData.count) || 0,
        };
    });
    return {
        counts: {
            userCounts,
            paymentCounts,
            postsCounts,
            groupCounts,
        },
        recentPosts,
        chartsData: {
            postsChartData,
            paymentsChartData,
        },
    };
});
exports.OverviewServices = {
    getAdminOverviewData,
};
