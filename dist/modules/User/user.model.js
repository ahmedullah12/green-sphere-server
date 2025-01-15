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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/* eslint-disable no-useless-escape */
const mongoose_1 = require("mongoose");
const user_constant_1 = require("./user.constant");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            'Please fill a valid email address',
        ],
        unique: true,
    },
    password: {
        type: String,
    },
    profilePhoto: {
        type: String,
    },
    role: {
        type: String,
        enum: Object.keys(user_constant_1.USER_ROLE),
        required: true,
    },
    followers: {
        type: [mongoose_1.Schema.Types.ObjectId],
        default: [],
        ref: "User",
    },
    following: {
        type: [mongoose_1.Schema.Types.ObjectId],
        default: [],
        ref: "User",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.password) {
            this.password = yield bcrypt_1.default.hash(this.password, 12);
        }
        next();
    });
});
userSchema.set('toJSON', {
    //not sending the password field
    transform: (doc, _a, option) => {
        var { password } = _a, rest = __rest(_a, ["password"]);
        return rest;
    },
});
userSchema.statics.isUserExistsByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email });
    });
};
userSchema.statics.isUserExistsById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findById(id);
    });
};
userSchema.statics.isPasswordMatched = function (plainPassword, hashPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainPassword, hashPassword);
    });
};
exports.User = (0, mongoose_1.model)('User', userSchema);
