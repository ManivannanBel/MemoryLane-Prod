import express, {Request, Response} from 'express';
import mongoose, {Model} from 'mongoose';
import { IMoment, IProfile, IMomentFile, IMemory } from '../../../types/modelTypes';
import passport from 'passport'
import Multer from 'multer';
import firebaseAdmin from 'firebase-admin';
import { Storage, Bucket, GetSignedUrlConfig } from '@google-cloud/storage';
import {uuid} from 'uuidv4';
import {IMomentResponse, IPerson} from '../../../types/responseTypes';

const firebaseStorageBucket = firebaseAdmin.storage().bucket();

const router = express.Router();

require('../../../models/moments');
const MomentModel : Model<IMoment> = mongoose.model<IMoment>("moments");
require('../../../models/momentFiles');
const MomentFileModel : Model<IMomentFile> = mongoose.model<IMomentFile>("momentFiles");
require('../../../models/profiles');
const ProfileModel : Model<IProfile> = mongoose.model<IProfile>("profiles");
require('../../../models/memories');
const MemoriesModel : Model<IMemory> = mongoose.model<IMemory>("memories");

const multer = Multer({
    storage : Multer.memoryStorage(),
    limits : {
        fileSize : 50 * 1024 * 1024
    }
});

//Moment creation controller
router.post('/', passport.authenticate('jwt', {session : false}), multer.fields([{name : 'body', maxCount: 1}, {name : 'file', maxCount: 10}]), async (req : Request, res : Response) => {
    
    //console.log(req.body);
    const {title, description, date} = req.body;

    let {visibility} = req.body;
    
    if(!visibility){
        visibility = 0;
    }
    // console.log(req.body);
    // console.log(req.body.group);
    
    const user : IProfile = (req.user as IProfile)
    //console.log(user);
    //User ID to Store in DB
    const groupId : any = [];
    //User details to send in response
    const groupRes : any = [];
    //if response contains group data
    if(req.body.group !== ''){
        const group : Array<string> = JSON.parse(req.body.group);
        for(const uname of group){
            const profileResult = await ProfileModel.findOne({username : uname}).select('_id firstname lastname username profileImage').exec();
            if(profileResult){
                groupId.push(profileResult._id);
                const person : IPerson = {
                    firstname : profileResult.firstname,
                    lastname : profileResult.lastname,
                    username : profileResult.username,
                    profilePic : profileResult.profileImage
                }
                groupRes.push(person);
            }      
        }
    }

    const newMoment = {
        ownerId : user.id,
        title,
        description,
        date,
        createdAt : new Date(),
        visibility,
        group : groupId,
        isActive : true
    }
    const moment : IMoment = await new MomentModel(newMoment).save();
    
    const firstname = user.firstname;
    const lastname = user.lastname;
    const username = user.username;
    const profilePic = user.profileImage;
    const momentResponse : IMomentResponse = {
        id : moment.id,
        title : moment.title,
        description : moment.description,
        group : groupRes,
        files : [],
        date : moment.date,
        createdAt : moment.createdAt,
        owner : { firstname, lastname, username, profilePic }
    }

    if(!((req.files as any).file) || (req.files as any).file.length === 0){
        return res.send(momentResponse);
    }
    
    const momentId : string = moment.id;
    const files : any = (req.files as any).file;
    const uploadFilesPromise : [Promise<string>] = files.map((file : any) => {
        try{
            return uploadImageToStorage(file, user.username);
        }catch(err){
            console.log(err);
        }
    })

    try{
        const urls : any = await Promise.all(uploadFilesPromise);

        const newMomentFile = {
            momentId,
            url : urls
        }
        const uploadedFiles : IMomentFile = await new MomentFileModel(newMomentFile).save();    
        momentResponse.files = uploadedFiles.url;
        res.send(momentResponse);
    }catch(err){
        console.log(err);
    }
    
});

router.post('/upload/:momentId', passport.authenticate('jwt', {session : false}), multer.array('file', 10), async (req : Request, res : Response) => {
    if(req.files === null){
        return res.status(400).json({msg : 'no files found'});
    }

    const momentId : string = req.params.momentId;
    //console.log(typeof(req.files));
    const files : any = req.files;
    const user : any = req.user;
    const uploadPromise = files.map((file : any) => {
        try{
            return uploadImageToStorage(file, user.username);
        }catch(err){
            console.log(err);
        }
    });

    try{
        const urls = await Promise.all(uploadPromise);
        //console.log('end');
        const newMomentFile = {
            momentId,
            url : urls
        }
        const result = await new MomentFileModel(newMomentFile).save();
        res.send(result);
    }catch(err){
        console.log(err);
        res.send(err);
    }
});

const uploadImageToStorage = async (file : any, username : any) : Promise<string> => {
    return new Promise((resolve : any, reject : any) => {
        if(!file){
            reject('no image file');
        }

        const _uuid = uuid();

        let newFilename = `moment/ML_${username}_${Date.now()}.${file.originalname.split('.').pop()}`;
        
        let fileToUpload = firebaseStorageBucket.file(newFilename);

        const blobStream = fileToUpload.createWriteStream({
            metadata : {
                contentType : file.mimetype,
                firebaseStorageDownloadTokens : _uuid
            }
        });
        
        blobStream.on('error', (error) => {
            reject('Something wrong in uploading file');
        })

        blobStream.on('finish', () => {
            const url : string = `https://firebasestorage.googleapis.com/v0/b/${firebaseStorageBucket.name}/o/${encodeURIComponent(fileToUpload.name)}?alt=media&token=${_uuid}`;
            resolve(url);
        });
        blobStream.end(file.buffer);
    })
}

//Get moment controller 
router.get('/:username', async (req : Request, res : Response) => {
    const username = req.params.username
    try{
        const ownerDetails : any = await ProfileModel.findOne({username : username}).select("_id username firstname lastname profileImage").exec();
        let results : any = await MomentModel.find({ownerId : ownerDetails._id}).sort("-date").exec();
        //console.log(results);
        //console.log("jjj");
        const responseArray = [];
        const firstname = ownerDetails.firstname;
        const lastname = ownerDetails.lastname;
        const profilePic = ownerDetails.profileImage;
        //console.log(profilePic);
        for(let i = 0; i < results.length; i++){
            const images : any = await MomentFileModel.findOne({momentId : results[i]._id}).select('url -_id').exec(); 
            //console.log(images.url);
            let urls : Array<string> = [];
            if(images){
                urls = images.url;
            }
            //results[i].url = (urls);
            console.log(results[i]);
            const groupIds = results[i].group;
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
                id : results[i].id,
                title : results[i].title,
                description : results[i].description,
                group : group,
                files : urls,
                date : results[i].date,
                createdAt : results[i].createdAt,
                owner : {firstname, lastname, username, profilePic}
            }
            responseArray.push(response);
        }
        //console.log(results);
        res.send({moments : responseArray});
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

//Update moment controller
router.put('/:momentId', passport.authenticate('jwt', {session : false}), multer.array('file', 10), async (req : Request, res : Response) => {
    const { title, description} = req.body;
    let {visibility} = req.body;
    
    if(!visibility){
        visibility = 0;
    }
    // console.log(req.body);
    // console.log(req.body.existingUrls);
    // console.log(typeof(req.body.existingUrls));
    const existingUrls : Array<string> = JSON.parse(req.body.existingUrls);
    const filesRemoved : Array<string> = JSON.parse(req.body.filesRemoved);
    // console.log(existingUrls);
    // console.log(typeof(existingUrls));
    const {momentId} = req.params;
    const user : any = req.user;
    const newFiles : any = req.files;
    try{
        // console.log(momentId);
        // console.log(user._id);
        const moment : IMoment = await MomentModel.findOne({_id : momentId, ownerId : user._id}).exec();
        
        if(!moment){
            return res.status(400).send("not updated");
        }

        //update moment title, description, groups
        const updatedMoment : IMoment = await MomentModel.findOneAndUpdate({_id : momentId, ownerId : user._id}, {title, description, visibility},{new : true}).exec();
        //console.log(updatedMoment);
        let newUrls : Array<string> = []

        //if new images are added then upload the files and get the urls
        // console.log(newFiles.length);
        // console.log(Array.isArray(newFiles));
        if(newFiles && newFiles.length > 0){
            const uploadPromise : Array<Promise<string>> = newFiles.map((file : any) => {
                try{
                    return uploadImageToStorage(file, user.username);
                }catch(err){
                    console.log(err);
                }
            });

            newUrls = await Promise.all(uploadPromise);
            console.log(newUrls);
        }

        //update urls list
        // console.log('1-----');
        // console.log(existingUrls);
        // console.log('2-----');
        // console.log(newUrls);
        const urls : Array<string> = [...existingUrls, ...newUrls];
        // console.log('----');
        // console.log(urls);
        const updatedFiles = await MomentFileModel.findOneAndUpdate({momentId}, {url : urls}, {new : true}).exec();

        //delete the removed files from storage
        // console.log(filesRemoved);
        // console.log(Array.isArray(filesRemoved));
        // console.log(typeof(filesRemoved));
        filesRemoved.map((url : string) => {
            let decodedURL = decodeURIComponent(url);
            let filename = decodedURL.slice(decodedURL.indexOf('/o/')+3, decodedURL.indexOf('?'));
            firebaseStorageBucket.file(filename).delete().then().catch();
        });

        //create response
        const {firstname, lastname, username, profileImage} = user;
        const response : IMomentResponse = {
            id : updatedMoment.id,
            title : updatedMoment.title,
            description : updatedMoment.description,
            group : updatedMoment.group as Array<string>,
            files : updatedFiles.url,
            date : updatedMoment.date,
            createdAt : updatedMoment.createdAt,
            owner : {firstname, lastname, username, profilePic : profileImage}
        }
        // console.log('res-------');
        // console.log(response);
        res.send(response);

    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
    //res.send('update moment');
});

//Delete moment controller
router.delete('/:momentId', passport.authenticate('jwt', {session : false}), async (req : Request, res : Response) => {
    
    const {momentId} = req.params;
    const user : any = req.user;
    console.log(user._id);
    try{
        console.log(`{_id : '${momentId}', ownerId : '${user._id}'}`)
        const moment = await MomentModel.findOne({_id : momentId, ownerId : user._id}).exec();
        // console.log(moment);
        if(!moment){
            return res.status(400).send('no such moment found');
        }
        const files = await MomentFileModel.findOne({momentId : momentId}).exec();
        console.log(files); 
        let urls = [];
        if(files){
            urls = files.url
            urls.map(url => {
                console.log(url);
                let decodedURL = decodeURIComponent(url);
                let filename = decodedURL.slice(decodedURL.indexOf('/o/')+3, decodedURL.indexOf('?'));
                firebaseStorageBucket.file(filename).delete().then().catch();
            })

            files.remove().then(() => moment.remove().then());
        }
        
        MemoriesModel.deleteMany({moment : momentId}).exec();
        MomentModel.findOneAndDelete({_id : momentId}).exec();

        res.send("deleted");
    }catch(err){
        console.log("in delete")
        console.log(err);
        res.status(500).send('failed');
    }
});

module.exports = router;