"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const momentSchema = new Schema({
    ownerId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'profiles',
        required: true
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    images: {
        type: [String]
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    group: {
        type: [mongoose_1.default.Types.ObjectId]
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});
mongoose_1.default.model('moments', momentSchema);
//# sourceMappingURL=moments.js.map