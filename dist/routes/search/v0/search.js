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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
require('../../../models/profiles');
const ProfileModel = mongoose_1.default.model("profiles");
router.get('/search/:query', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { query } = req.params;
    try {
        const searchResult = yield ProfileModel.find({ username: { $regex: `${query}`, $options: 'i' } }).select('username firstname lastname profileImage -_id').exec();
        res.send(searchResult);
    }
    catch (err) {
        res.status(400).send(err);
    }
}));
router.get('/usearch/:query', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { query } = req.params;
    try {
        const searchResult = yield ProfileModel.find({ username: { $regex: `${query}`, $options: 'i' } }).select('username firstname lastname profileImage -_id').exec();
        res.send(searchResult);
    }
    catch (err) {
        res.status(400).send(err);
    }
}));
module.exports = router;
//# sourceMappingURL=search.js.map