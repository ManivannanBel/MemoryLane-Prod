"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const memorySchema = new Schema({
    moment: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'moments'
    },
    owner: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'profiles'
    },
    memory: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});
// memorySchema.method('transform', () => {
//     let obj = this.toObject();
//     obj.id = obj._id;
//     delete obj._id;
//     return obj;
// });
// memorySchema.method('transform', function() {
//     var obj = this.toObject();
//     //Rename fields
//     obj.id = obj._id;
//     delete obj._id;
//     return obj;
// });
module.exports = mongoose_1.default.model("memories", memorySchema);
//# sourceMappingURL=memories.js.map