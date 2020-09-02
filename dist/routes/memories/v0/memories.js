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
require('../../../models/memories');
const MemoryModel = mongoose_1.default.model('memories');
require('../../../models/profiles');
const ProfileModel = mongoose_1.default.model('profiles');
//Memory creation controller
router.post('/:momentId', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { memory } = req.body;
    const momentId = req.params.momentId;
    const user = req.user;
    const newMemory = {
        moment: momentId,
        owner: user.id,
        memory,
        createdAt: Date.now(),
        isActive: true
    };
    try {
        const memoryResult = yield new MemoryModel(newMemory).save();
        const firstname = user.firstname;
        const lastname = user.lastname;
        const profilePic = user.profileImage;
        const username = user.username;
        const memoryResponse = {
            id: memoryResult.id,
            owner: { firstname, lastname, username, profilePic },
            memory: memoryResult.memory,
            createdAt: memoryResult.createdAt
        };
        res.send({ moment: momentId, memory: memoryResponse });
    }
    catch (err) {
        console.log(err);
        res.send("err");
    }
    //res.send('create memory');
}));
//Get all memories controller
router.get('/:momentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const momentId = req.params.momentId;
    //console.log(momentId);
    try {
        const memoriesResult = yield MemoryModel.find({ moment: momentId }).select('-isActive -__v').populate('owner', 'firstname lastname username profileImage -_id').sort('-date').exec();
        //console.log(memoriesResult);
        const memoriesResponse = [];
        for (let i = 0; i < memoriesResult.length; i++) {
            const owner = memoriesResult[i].owner;
            const _owner = {
                firstname: owner.firstname,
                lastname: owner.lastname,
                username: owner.username,
                profilePic: owner.profileImage
            };
            const _memory = {
                id: memoriesResult[i].id,
                //moment : memoriesResult[i].moment,
                owner: _owner,
                memory: memoriesResult[i].memory,
                createdAt: memoriesResult[i].createdAt
            };
            memoriesResponse.push(_memory);
        }
        res.send({ moment: momentId, memories: memoriesResponse });
    }
    catch (err) {
        console.log(err);
        res.send(err);
    }
    //res.send('get all memories');
}));
//Update memory controller
router.put('/:momentId/:memoryId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('update memory');
}));
//Delete memory controller
router.delete('/:momentId/:memoryId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('delete memory');
}));
module.exports = router;
//# sourceMappingURL=memories.js.map