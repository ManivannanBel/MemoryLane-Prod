import mongoose, {Model} from 'mongoose';
import express, {Request, Response} from 'express';
import { IRelationship, IMoment, IMomentFile, IProfile } from '../../../types/modelTypes';
import passport from 'passport';
import { IMomentResponse, IPerson } from '../../../types/responseTypes';

const router = express.Router();

require('../../../models/relationships');
const RelationshipModel : Model<IRelationship> = mongoose.model('relationships');
require('../../../models/moments');
const MomentModel : Model<IMoment> = mongoose.model('moments');
require('../../../models/momentFiles');
const MomentFileModel : Model<IMomentFile> = mongoose.model('momentFiles');
require('../../../models/profiles');
const ProfileModel : Model<IProfile> = mongoose.model('profiles');

//Memory lane controller
router.get('/', passport.authenticate('jwt', {session : false}), async (req : Request, res : Response) => {
    const user : any  = req.user;
    try{
        const relationshipResult : any = await RelationshipModel.find({ $and : [{ $or : [{user1 : user._id}, {user2 : user._id}]}, {status : 1}]}).select('user1 user2').exec();
        console.log(relationshipResult);
        const friends : any = [];
        for(let relationship of relationshipResult){
            if(!(user._id).equals(relationship.user1)){
                friends.push(relationship.user1);
            }else{
                friends.push(relationship.user2);
            }
        }
        console.log(friends);
        //console.log(Array.isArray(relationshipResult));
        const momentResult : any = await MomentModel.find({ ownerId : { $in : friends }}).populate('ownerId', '-_id username firstname lastname profileImage').exec();
        console.log(momentResult);
        // const r = await MomentModel.findOne({ownerId : "5edb6123823146361c03ddd0"}).exec();
        // console.log(r)
        const responseArray = [];
        
        for(let i = 0; i < momentResult.length; i++){
            const images : any = await MomentFileModel.findOne({momentId : momentResult[i]._id}).select('url -_id').exec();
            let urls = [];
            if(images){
                urls = images.url;
            }

            const groupIds = momentResult[i].group;
            const group : Array<IPerson> = [];
                for(const id of groupIds){
                    const profileResult = await ProfileModel.findById({_id : id}).select('username firstname lastname profileImage -_id').exec();
                    const person : IPerson = {
                        firstname : profileResult.firstname,
                        lastname : profileResult.lastname,
                        username : profileResult.username,
                        profilePic : profileResult.profileImage
                    }
                    group.push(person);
                }

            const response : IMomentResponse = {
                id : momentResult[i].id,
                title : momentResult[i].title,
                description : momentResult[i].description,
                group : group,
                files : urls,
                date : momentResult[i].date,
                createdAt : momentResult[i].createdAt,
                owner : {
                    username : momentResult[i].ownerId.username,
                    firstname : momentResult[i].ownerId.firstname,
                    lastname : momentResult[i].ownerId.lastname, 
                    profilePic : momentResult[i].ownerId.profileImage}
            }
            responseArray.push(response);
        }
        res.send(responseArray);
    }catch(err){
        console.log(err);
        res.status(500).send('err');
    }
    //res.send('memorylane');
});

module.exports = router;