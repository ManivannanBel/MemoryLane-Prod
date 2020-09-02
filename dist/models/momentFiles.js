"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const momentFileSchema = new Schema({
    momentId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'moments',
        required: true
    },
    url: [String]
});
module.exports = mongoose_1.default.model('momentFiles', momentFileSchema);
//# sourceMappingURL=momentFiles.js.map