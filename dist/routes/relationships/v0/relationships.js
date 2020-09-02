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
require('../../../models/relationships');
const RelationshipModel = mongoose_1.default.model('relationships');
require('../../../models/profiles');
const ProfileModel = mongoose_1.default.model("profiles");
//send friend request
router.post('/fr', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user2username } = req.body;
    const user1 = req.user;
    if (user1.username === user2username) {
        return res.status(200).send({ status: -1 });
    }
    try {
        //Find user2
        const user2 = yield ProfileModel.findOne({ username: user2username, isActive: true }).select('_id').exec();
        console.log(user2);
        if (!user2) {
            return res.status(404).send('user not found');
        }
        console.log(`${user1._id} ${typeof (user1._id)}`);
        console.log(`${user2._id} ${typeof (user2._id)}`);
        let userId1_String = user1._id.toHexString();
        let userId2_String = user2._id.toHexString();
        // console.log(`${userId1_String} ${typeof(userId1_String)} ${userId1_String.length}`);
        // console.log(`${userId2_String} ${typeof(userId2_String)}`);
        if (userId1_String.localeCompare(userId2_String) === 1) {
            const t = userId1_String;
            userId1_String = userId2_String;
            userId2_String = t;
        }
        let relationship = yield RelationshipModel.findOne({ user1: userId1_String, user2: userId2_String }).exec();
        console.log(`rel = ${relationship}`);
        if (relationship && relationship.status === 2 && user1._id.equals(relationship.actionUser)) {
            //if the other person has sent request and you have rejected it, but you can still send request to that person and that person cannot.
            relationship.status = 0;
            relationship.actionUser = user1._id;
            const reslut = yield relationship.save();
            const userAction = (user1._id.equals(reslut.actionUser)) ? "you" : "otherPerson";
            return res.status(200).send({ status: reslut.status, userAction: userAction });
        }
        else if (relationship) {
            return res.status(400).send("this action is not possible");
        }
        //if no relationship record exists, then we will create new record
        const newRelationship = {
            user1: userId1_String,
            user2: userId2_String,
            status: 0,
            actionUser: user1._id
        };
        relationship = yield new RelationshipModel(newRelationship).save();
        console.log(`rel n = ${relationship}`);
        const userAction = (user1._id.equals(relationship.actionUser)) ? "you" : "otherPerson";
        res.status(200).send({ status: relationship.status, userAction: userAction });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}));
//get relationship status
router.get('/:username2', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username2 } = req.params;
    const user1 = req.user;
    console.log('llll');
    try {
        const user2 = yield ProfileModel.findOne({ username: username2, isActive: true }).select('_id').exec();
        if (!user2) {
            return res.status(404).send("user not found");
        }
        let userId1_String = user1._id.toHexString();
        let userId2_String = user2._id.toHexString();
        if (userId1_String.localeCompare(userId2_String) === 1) {
            const t = userId1_String;
            userId1_String = userId2_String;
            userId2_String = t;
        }
        const relationship = yield RelationshipModel.findOne({ user1: userId1_String, user2: userId2_String }).select('status actionUser').exec();
        console.log(`rel ${relationship}`);
        if (!relationship) {
            return res.status(200).send({ status: -1, userAction: null });
        }
        console.log(user1._id);
        console.log(relationship.actionUser);
        const userAction = (user1._id.equals(relationship.actionUser)) ? "you" : "otherPerson";
        return res.status(200).send({ status: relationship.status, userAction: userAction });
    }
    catch (err) {
        console.log(err);
        res.send(400).send(err);
    }
}));
//accept frient request
router.put('/:action', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user2username } = req.body;
    const user1 = req.user;
    const { action } = req.params;
    if (user1.username === user2username) {
        return res.status(200).send({ status: -1 });
    }
    try {
        const user2 = yield ProfileModel.findOne({ username: user2username, isActive: true }).select('_id').exec();
        if (!user2) {
            return res.status(404).send("user not found");
        }
        let userId1_String = user1._id.toHexString();
        let userId2_String = user2._id.toHexString();
        if (userId1_String.localeCompare(userId2_String) === 1) {
            const t = userId1_String;
            userId1_String = userId2_String;
            userId2_String = t;
        }
        const relationship = yield RelationshipModel.findOne({ user1: userId1_String, user2: userId2_String }).exec();
        console.log(relationship);
        switch (action) {
            case 'acceptRequest':
                {
                    //relationship must exists,
                    //last action must be performed by the other user (sending request)
                    //status must be in pending state
                    if (!relationship || !(relationship.actionUser).equals(user2._id) || relationship.status !== 0) {
                        return res.status(400).send({ status: -1 });
                    }
                    relationship.status = 1;
                    relationship.actionUser = user1._id;
                    relationship.date = Date.now();
                    const result = yield relationship.save();
                    console.log(result);
                    console.log(user1._id.equals(result.actionUser));
                    const userAction = (user1._id.equals(result.actionUser)) ? "you" : "otherPerson";
                    return res.status(200).send({ status: result.status, userAction: userAction });
                }
            case 'rejectRequest':
                {
                    //relationship must exists,
                    //last action must be performed by the other user (sending request)
                    //status must be in pending state
                    if (!relationship || !(relationship.actionUser).equals(user2._id) || relationship.status !== 0) {
                        return res.status(200).send({ status: -1 });
                    }
                    relationship.status = 2;
                    relationship.actionUser = user1._id;
                    const result = yield relationship.save();
                    const userAction = (user1._id.equals(result.actionUser)) ? "you" : "otherPerson";
                    return res.status(200).send({ status: result.status, userAction: userAction });
                }
            case 'cancelRequest':
                {
                    //relationship must exists,
                    //last action must be performed by the current user (sending request)
                    //status must be in pending state
                    if (!relationship || !(relationship.actionUser).equals(user1._id) || relationship.status !== 0) {
                        return res.status(200).send({ status: -1 });
                    }
                    // relationship.status = 1;
                    // relationship.actionUser = user1._id;
                    // const reslut = await relationship.save();
                    yield RelationshipModel.deleteOne({ user1: userId1_String, user2: userId2_String }).exec();
                    return res.status(200).send({ status: -1 });
                }
            case 'block':
                {
                    //if no relationship exists, create new one
                    if (!relationship) {
                        const newRelationship = {
                            user1: userId1_String,
                            user2: userId2_String,
                            status: 3,
                            actionUser: user1._id
                        };
                        const relationship = yield new RelationshipModel(newRelationship).save();
                        const userAction = (user1._id.equals(relationship.actionUser)) ? "you" : "otherPerson";
                        return res.status(200).send({ status: relationship.status, userAction: userAction });
                    }
                    //if already in blocked status
                    if (relationship.status === 3 && !(relationship.actionUser).equals(user2._id)) {
                        return res.status(200).send({ status: relationship.status });
                    }
                    //if the other user has block you already
                    if (relationship.status === 3 && (relationship.actionUser).equals(user2._id)) {
                        return res.status(200).send({ status: -1 });
                    }
                    //update status
                    relationship.status = 3;
                    relationship.actionUser = user1._id;
                    const result = yield relationship.save();
                    const userAction = (user1._id.equals(result.actionUser)) ? "you" : "otherPerson";
                    return res.status(200).send({ status: result.status, userAction: userAction });
                }
            case 'unblock':
                {
                    //relationship must exists,
                    //last action must be performed by the current user (blocking the other person)
                    //status must be in blocked state
                    if (!relationship || !(relationship.actionUser).equals(user1._id) || relationship.status !== 3) {
                        return res.status(200).send({ status: -1 });
                    }
                    // relationship.status = -1;
                    // relationship.actionUser = user1._id;
                    // const reslut = await relationship.save();
                    yield RelationshipModel.deleteOne({ user1: userId1_String, user2: userId2_String }).exec();
                    return res.status(200).send({ status: -1 });
                }
            case 'unfriend':
                {
                    //relationship must exists,
                    //status must be in accepted state
                    if (!relationship || relationship.status !== 1) {
                        return res.status(200).send({ status: -1 });
                    }
                    // relationship.status = 1;
                    // relationship.actionUser = user1._id;
                    // const reslut = await relationship.save();
                    yield RelationshipModel.deleteOne({ user1: userId1_String, user2: userId2_String }).exec();
                    return res.status(200).send({ status: -1 });
                }
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}));
module.exports = router;
//# sourceMappingURL=relationships.js.map