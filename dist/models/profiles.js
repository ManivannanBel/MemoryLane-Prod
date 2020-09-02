"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const profileSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
    },
    confirmationCode: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    googleId: {
        type: String
    },
    facebookId: {
        type: String
    },
    profileImage: {
        type: String
    }
});
mongoose_1.default.model('profiles', profileSchema);
//# sourceMappingURL=profiles.js.map