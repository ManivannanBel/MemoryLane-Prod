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
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
require('../../../models/relationships');
const RelationshipModel = mongoose_1.default.model('relationships');
require('../../../models/moments');
const MomentModel = mongoose_1.default.model('moments');
require('../../../models/momentFiles');
const MomentFileModel = mongoose_1.default.model('momentFiles');
require('../../../models/profiles');
const ProfileModel = mongoose_1.default.model('profiles');
//Memory lane controller
router.get('/', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const relationshipResult = yield RelationshipModel.find({ $and: [{ $or: [{ user1: user._id }, { user2: user._id }] }, { status: 1 }] }).select('user1 user2').exec();
        console.log(relationshipResult);
        const friends = [];
        for (let relationship of relationshipResult) {
            if (!(user._id).equals(relationship.user1)) {
                friends.push(relationship.user1);
            }
            else {
                friends.push(relationship.user2);
            }
        }
        console.log(friends);
        //console.log(Array.isArray(relationshipResult));
        const momentResult = yield MomentModel.find({ ownerId: { $in: friends } }).populate('ownerId', '-_id username firstname lastname profileImage').exec();
        console.log(momentResult);
        // const r = await MomentModel.findOne({ownerId : "5edb6123823146361c03ddd0"}).exec();
        // console.log(r)
        const responseArray = [];
        for (let i = 0; i < momentResult.length; i++) {
            const images = yield MomentFileModel.findOne({ momentId: momentResult[i]._id }).select('url -_id').exec();
            let urls = [];
            if (images) {
                urls = images.url;
            }
            const groupIds = momentResult[i].group;
            const group = [];
            for (const id of groupIds) {
                const profileResult = yield ProfileModel.findById({ _id: id }).select('username firstname lastname profileImage -_id').exec();
                const person = {
                    firstname: profileResult.firstname,
                    lastname: profileResult.lastname,
                    username: profileResult.username,
                    profilePic: profileResult.profileImage
                };
                group.push(person);
            }
            const response = {
                id: momentResult[i].id,
                title: momentResult[i].title,
                description: momentResult[i].title,
                group: group,
                files: urls,
                date: momentResult[i].date,
                createdAt: momentResult[i].createdAt,
                owner: {
                    username: momentResult[i].ownerId.username,
                    firstname: momentResult[i].ownerId.firstname,
                    lastname: momentResult[i].ownerId.lastname,
                    profilePic: momentResult[i].ownerId.profileImage
                }
            };
            responseArray.push(response);
        }
        res.send(responseArray);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('err');
    }
    //res.send('memorylane');
}));
module.exports = router;
//# sourceMappingURL=memoryLane.js.map