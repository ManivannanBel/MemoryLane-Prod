import express, {Request, Response} from 'express';
import mongoose, {Document, Model} from 'mongoose';
import { IRelationship, IProfile } from '../../../types/modelTypes';
import passport from 'passport';
import { IPerson } from '../../../types/responseTypes';

const router = express.Router();

require('../../../models/relationships');
const RelationshipModel : Model<IRelationship> = mongoose.model<IRelationship>('relationships');
require('../../../models/profiles');
const ProfileModel : Model<IProfile> = mongoose.model<IProfile>("profiles");

//send friend request
router.post('/fr', passport.authenticate('jwt', {session : false}), async (req : Request, res : Response) => {
    const {user2username} = req.body;
    const user1 : any = req.user;
    if(user1.username === user2username){
        return res.status(200).send({status : -1});
    }
    try{
        //Find user2
        const user2 : any = await ProfileModel.findOne({username : user2username, isActive : true}).select('_id').exec();
        console.log(user2);
        if(!user2){
            return res.status(404).send('user not found');
        }

        console.log(`${user1._id} ${typeof(user1._id)}`);
        console.log(`${user2._id} ${typeof(user2._id)}`);
        let userId1_String : string = user1._id.toHexString();
        let userId2_String : string = user2._id.toHexString();
        // console.log(`${userId1_String} ${typeof(userId1_String)} ${userId1_String.length}`);
        // console.log(`${userId2_String} ${typeof(userId2_String)}`);

        if(userId1_String.localeCompare(userId2_String) === 1){
            const t : string = userId1_String;
            userId1_String = userId2_String;
            userId2_String = t;
        }

        let relationship : any = await RelationshipModel.findOne({user1 : userId1_String, user2 : userId2_String}).exec();
        console.log(`rel = ${relationship}`);
        if(relationship && relationship.status === 2 && user1._id.equals(relationship.actionUser)){
            //if the other person has sent request and you have rejected it, but you can still send request to that person and that person cannot.
            relationship.status = 0;
            relationship.actionUser = user1._id;
            const reslut = await relationship.save();
            const userAction = (user1._id.equals(reslut.actionUser)) ? "you" : "otherPerson";
            return res.status(200).send({status : reslut.status, userAction : userAction});
        }else if(relationship){
            return res.status(400).send("this action is not possible");
        }
        
        //if no relationship record exists, then we will create new record
        const newRelationship = {
            user1 : userId1_String,
            user2 : userId2_String,
            status : 0,
            actionUser : user1._id
        }

        relationship = await new RelationshipModel(newRelationship).save();
        console.log(`rel n = ${relationship}`);
        const userAction = (user1._id.equals(relationship.actionUser)) ? "you" : "otherPerson";
        res.status(200).send({status : relationship.status, userAction : userAction});
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

//get relationship status
router.get('/status/:username2', passport.authenticate('jwt', {session : false}), async (req : Request, res : Response) => {
    const {username2} = req.params;
    const user1 : any = req.user;
    console.log('llll');
    try{
        const user2 : any = await ProfileModel.findOne({username : username2, isActive : true}).select('_id').exec();
        if(!user2){
            return res.status(404).send("user not found");
        }
        let userId1_String : string = user1._id.toHexString();
        let userId2_String : string = user2._id.toHexString();
        if(userId1_String.localeCompare(userId2_String) === 1){
            const t : string = userId1_String;
            userId1_String = userId2_String;
            userId2_String = t;
        }
        const relationship : any = await RelationshipModel.findOne({user1 : userId1_String, user2 : userId2_String}).select('status actionUser').exec();
        console.log(`rel ${relationship}`);
        if(!relationship){
            return res.status(200).send({status : -1, userAction : null});            
        }
        console.log(user1._id);
        console.log(relationship.actionUser);
        const userAction = (user1._id.equals(relationship.actionUser)) ? "you" : "otherPerson";
        return res.status(200).send({status : relationship.status, userAction : userAction});
    }catch(err){
        console.log(err);
        res.send(400).send(err);
    }
});

//accept frient request
router.put('/fr/:action', passport.authenticate('jwt', {session : false}), async (req : Request, res : Response) => {
    const {user2username} = req.body;
    const user1 : any = req.user;
    const {action} = req.params;
    if(user1.username === user2username){
        return res.status(200).send({status : -1});
    }
    try{
        const user2 : any = await ProfileModel.findOne({username : user2username, isActive : true}).select('_id').exec();
        if(!user2){
            return res.status(404).send("user not found");
        }
        let userId1_String : string = user1._id.toHexString();
        let userId2_String : string = user2._id.toHexString();
        if(userId1_String.localeCompare(userId2_String) === 1){
            const t : string = userId1_String;
            userId1_String = userId2_String;
            userId2_String = t;
        }
        const relationship : any = await RelationshipModel.findOne({user1 : userId1_String, user2 : userId2_String}).exec();
        console.log(relationship);
        switch(action){
            case 'acceptRequest':
                {
                    //relationship must exists,
                    //last action must be performed by the other user (sending request)
                    //status must be in pending state
                    if(!relationship || !(relationship.actionUser).equals(user2._id) || relationship.status !== 0){
                        return res.status(400).send({status : -1});            
                    }
                    relationship.status = 1;
                    relationship.actionUser = user1._id;
                    relationship.date = Date.now();
                    const result = await relationship.save();
                    console.log(result);
                    console.log(user1._id.equals(result.actionUser));
                    const userAction = (user1._id.equals(result.actionUser)) ? "you" : "otherPerson";
                    return res.status(200).send({status : result.status, userAction : userAction});
                }
            case 'rejectRequest':
                {
                    //relationship must exists,
                    //last action must be performed by the other user (sending request)
                    //status must be in pending state
                    if(!relationship || !(relationship.actionUser).equals(user2._id) || relationship.status !== 0){
                        return res.status(200).send({status : -1});            
                    }
                    relationship.status = 2;
                    relationship.actionUser = user1._id;
                    const result = await relationship.save();
                    const userAction = (user1._id.equals(result.actionUser)) ? "you" : "otherPerson";
                    return res.status(200).send({status : result.status, userAction : userAction});
                }
            case 'cancelRequest':
                {
                    //relationship must exists,
                    //last action must be performed by the current user (sending request)
                    //status must be in pending state
                    if(!relationship || !(relationship.actionUser).equals(user1._id) || relationship.status !== 0){
                        return res.status(200).send({status : -1});            
                    }
                    // relationship.status = 1;
                    // relationship.actionUser = user1._id;
                    // const reslut = await relationship.save();
                    await RelationshipModel.deleteOne({user1 : userId1_String, user2 : userId2_String}).exec();
                    return res.status(200).send({status : -1});
                }
            case 'block':
                {   
                    //if no relationship exists, create new one
                    if(!relationship){
                        const newRelationship = {
                            user1 : userId1_String,
                            user2 : userId2_String,
                            status : 3,
                            actionUser : user1._id
                        }
                
                        const relationship = await new RelationshipModel(newRelationship).save();
                        const userAction = (user1._id.equals(relationship.actionUser)) ? "you" : "otherPerson";
                        return res.status(200).send({status : relationship.status, userAction : userAction});  
                    }
                    //if already in blocked status
                    if(relationship.status === 3 && !(relationship.actionUser).equals(user2._id)){
                        return res.status(200).send({status : relationship.status});
                    }
                    //if the other user has block you already
                    if(relationship.status === 3 && (relationship.actionUser).equals(user2._id)){
                        return res.status(200).send({status : -1});
                    }
                    //update status
                    relationship.status = 3;
                    relationship.actionUser = user1._id;
                    const result = await relationship.save();
                    const userAction = (user1._id.equals(result.actionUser)) ? "you" : "otherPerson";
                    return res.status(200).send({status : result.status, userAction : userAction});
                }
            case 'unblock':
                {
                    //relationship must exists,
                    //last action must be performed by the current user (blocking the other person)
                    //status must be in blocked state
                    if(!relationship || !(relationship.actionUser).equals(user1._id) || relationship.status !== 3){
                        return res.status(200).send({status : -1});            
                    }
                    // relationship.status = -1;
                    // relationship.actionUser = user1._id;
                    // const reslut = await relationship.save();
                    await RelationshipModel.deleteOne({user1 : userId1_String, user2 : userId2_String}).exec();
                    return res.status(200).send({status : -1});
                }
            case 'unfriend':
                {
                    //relationship must exists,
                    //status must be in accepted state
                    if(!relationship || relationship.status !== 1){
                        return res.status(200).send({status : -1});            
                    }
                    // relationship.status = 1;
                    // relationship.actionUser = user1._id;
                    // const reslut = await relationship.save();
                    await RelationshipModel.deleteOne({user1 : userId1_String, user2 : userId2_String}).exec();
                    return res.status(200).send({status : -1});
                }
        }
    }catch(err){
        console.log(err);
        res.status(400).send(err);
    }
});

router.get('/friends', passport.authenticate('jwt', {session : false}), async (req : Request, res : Response) => {
    const user : any = req.user;
    try{
        const friends : Array<IRelationship> = await RelationshipModel.find({$or : [{user1 : user._id}, {user2 : user._id}]}).select('user1 user2').populate('user1', 'firstname lastname username profileImage _id').populate('user2', 'firstname lastname username profileImage _id').exec();
        const response = [];
        for(let i = 0; i < friends.length; i++){
            let user1 : any = friends[i].user1;
            let user2 : any = friends[i].user2;
            let person = {};
            if(user.equals(user1._id)){
                person = {
                    firstname: user2.firstname,
                    lastname: user2.lastname,
                    username: user2.username,
                    profileImage: user2.profileImage
                }
            }else{
                person = {
                    firstname: user1.firstname,
                    lastname: user1.lastname,
                    username: user1.username,
                    profileImage: user1.profileImage
                }
            }
            response.push(person);
        }
        res.status(200).send(response);
    }catch(err){
        res.status(500).send(err);
    }
});

module.exports = router;