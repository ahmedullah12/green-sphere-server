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
exports.PaymentCollectionService = void 0;
const payment_utils_1 = require("../Payment/payment.utils");
const payment_collection_model_1 = require("./payment-collection.model");
const createPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_collection_model_1.Payment.create(payload);
    const transactionId = `TXN-RR-${Date.now()}`;
    const paymentData = {
        transactionId,
        userId: payment.userId,
        paymentId: payment._id,
        totalAmount: payment === null || payment === void 0 ? void 0 : payment.totalAmount,
        customerName: payment === null || payment === void 0 ? void 0 : payment.name,
        customerEmail: payment === null || payment === void 0 ? void 0 : payment.email,
        customerPhone: payment === null || payment === void 0 ? void 0 : payment.phone,
        customerAddress: payment === null || payment === void 0 ? void 0 : payment.address,
    };
    const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData);
    return paymentSession;
});
const getPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield payment_collection_model_1.Payment.find().populate("userId");
    return payments;
});
exports.PaymentCollectionService = {
    createPayment,
    getPayments,
};
