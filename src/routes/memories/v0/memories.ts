import express, {Request, Response} from 'express';
import mongoose, {Model} from 'mongoose';
import passport from 'passport';
import { IMemory, IMoment, IProfile } from '../../../types/modelTypes';
import { IMemoryResponse, IPerson } from '../../../types/responseTypes';

const router = express.Router();

require('../../../models/memories');
const MemoryModel : Model<IMemory> = mongoose.model<IMemory>('memories');
require('../../../models/profiles');
const ProfileModel : Model<IProfile> = mongoose.model<IProfile>('profiles');

//Memory creation controller
router.post('/:momentId', passport.authenticate('jwt', {session : false}), async (req : Request, res : Response) => {

    const { memory } = req.body;
    const momentId = req.params.momentId;
    const user : any = req.user;

    const newMemory = {
        moment : momentId,
        owner : user.id,
        memory,
        createdAt : Date.now(),
        isActive : true
    }

    try{
        const memoryResult : IMemory = await new MemoryModel(newMemory).save();
        const firstname = user.firstname;
        const lastname = user.lastname;
        const profilePic = user.profileImage;
        const username = user.username;
        
        const memoryResponse : IMemoryResponse = {
            id : memoryResult.id,
            owner : {firstname, lastname, username, profilePic},
            memory : memoryResult.memory,
            createdAt : memoryResult.createdAt
        }
        res.send({moment : momentId , memory : memoryResponse});
    }catch(err){
        console.log(err);
        res.send("err");
    }

    //res.send('create memory');
});

//Get all memories controller
router.get('/:momentId',  passport.authenticate('jwt', {session : false}), async (req : Request, res : Response) => {
    
    const momentId = req.params.momentId;
    //console.log(momentId);
    try{
        const memoriesResult : Array<IMemory> = await MemoryModel.find({moment : momentId}).select('-isActive -__v').populate('owner', 'firstname lastname username profileImage -_id').sort('-date').exec();
        //console.log(memoriesResult);
        
        const memoriesResponse = []

        for(let i = 0; i < memoriesResult.length; i++){
            
            const owner : any = memoriesResult[i].owner;
            const _owner : IPerson = {
                firstname : owner.firstname,
                lastname : owner.lastname,
                username : owner.username,
                profilePic : owner.profileImage
            }
            const _memory : IMemoryResponse = {
                id : memoriesResult[i].id,
                //moment : memoriesResult[i].moment,
                owner : _owner,
                memory : memoriesResult[i].memory,
                createdAt : memoriesResult[i].createdAt
            }
            memoriesResponse.push(_memory);
        }

        res.send({moment : momentId, memories : memoriesResponse});
    }catch(err){
        console.log(err);
        res.send(err);
    }

    //res.send('get all memories');
});

//Update memory controller
router.put('/:momentId/:memoryId',  passport.authenticate('jwt', {session : false}), async (req : Request, res : Response) => {
    res.send('update memory');
});

//Delete memory controller
router.delete('/:momentId/:memoryId',  passport.authenticate('jwt', {session : false}), async (req : Request, res : Response) => {
    const user : any = req.user;
    const {momentId, memoryId} = req.params;
    try{
        console.log(momentId + " " + memoryId);
        const result = await MemoryModel.findOneAndDelete({_id : memoryId, owner : user._id, moment : momentId}).exec();
        console.log(result);
        res.status(200).send("Memory deleted");
    }catch(err){
        res.status(500).send("error in deletion of memory");
    }
});

module.exports = router;