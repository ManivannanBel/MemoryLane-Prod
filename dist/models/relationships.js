"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const RelationshipSchema = new Schema({
    user1: {
        //smaller id by comparision
        type: mongoose_1.default.Types.ObjectId,
        ref: 'profiles',
        required: true
    },
    user2: {
        //greater id by comparision
        type: mongoose_1.default.Types.ObjectId,
        ref: 'profiles',
        required: true
    },
    status: {
        //0	Pending
        //1	Accepted
        //2	Declined
        //3	Blocked
        type: Number,
        required: true
    },
    actionUser: {
        //Who performed the last action
        type: mongoose_1.default.Types.ObjectId,
        ref: 'profiles',
        required: true
    },
    date: {
        //when request is sent?, when was friended? 
        type: Date,
        required: true,
        default: Date.now
    }
});
RelationshipSchema.index({ 'user1': 1, 'user2': 1 }, { unique: true });
module.exports = mongoose_1.default.model('relationships', RelationshipSchema);
//# sourceMappingURL=relationships.js.map