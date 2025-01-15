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
exports.PaymentServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const path_1 = require("path");
const fs_1 = require("fs");
const payment_utils_1 = require("./payment.utils");
const user_model_1 = require("../User/user.model");
const payment_collection_model_1 = require("../PaymentsCollection/payment-collection.model");
const confirmationService = (transactionId, userId, paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyResponse = yield (0, payment_utils_1.verifyPayment)(transactionId);
    let result;
    let message = '';
    if (verifyResponse && verifyResponse.pay_status === 'Successful') {
        result = yield user_model_1.User.findOneAndUpdate({ _id: userId }, { isVerified: true }, { new: true });
        yield payment_collection_model_1.Payment.findByIdAndUpdate(paymentId, { isConfirmed: true }, { new: true });
        message = 'Successfully Paid!!!';
    }
    else {
        message = 'Payment Failed!!!';
    }
    const filePath = (0, path_1.join)(__dirname, '../../../public/confirmation.html');
    let template = (0, fs_1.readFileSync)(filePath, 'utf-8');
    // Replace placeholders with actual data
    template = template.replace('{{message}}', message);
    template = template.replace('{{bookingId}}', userId);
    return template;
});
exports.PaymentServices = {
    confirmationService,
};
