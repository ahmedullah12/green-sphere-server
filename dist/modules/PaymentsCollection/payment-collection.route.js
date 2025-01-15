"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCollectionRoutes = void 0;
const express_1 = require("express");
const payment_collection_controller_1 = require("./payment-collection.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.post('/create-payment', payment_collection_controller_1.PaymentCollectionController.createPayment);
router.get('/', (0, auth_1.default)('ADMIN'), payment_collection_controller_1.PaymentCollectionController.getPayments);
exports.PaymentCollectionRoutes = router;
