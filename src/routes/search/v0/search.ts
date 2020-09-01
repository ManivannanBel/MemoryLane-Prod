import express, {Request, Response} from 'express';
import mongoose, {Document, Model} from 'mongoose';
import { IProfile } from '../../../types/modelTypes';
import passport from 'passport';

const router = express.Router();

require('../../../models/profiles');
const ProfileModel : Model<IProfile> = mongoose.model<IProfile>("profiles");

router.get('/search/:query', passport.authenticate('jwt', {session : false}), async (req : Request, res : Response) => {
    const user : any = req.user;
    const {query} = req.params;
    try{
        const searchResult = await ProfileModel.find({username : {$regex : `${query}`, $options : 'i'}}).select('username firstname lastname profileImage -_id').exec();
        res.send(searchResult);
    }catch(err){
        res.status(400).send(err);
    }
})

router.get('/usearch/:query', passport.authenticate('jwt', {session : false}), async (req : Request, res : Response) => {
    const user : any = req.user;
    const {query} = req.params;
    try{
        const searchResult = await ProfileModel.find({username : {$regex : `${query}`, $options : 'i'}}).select('username firstname lastname profileImage -_id').exec();
        res.send(searchResult);
    }catch(err){
        res.status(400).send(err);
    }
})

module.exports = router;