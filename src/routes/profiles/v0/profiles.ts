import express, {Request, Response} from 'express';
import mongoose, {Document, Model} from 'mongoose';
import { IProfile } from '../../../types/modelTypes';
import passport from 'passport';
import queryString from 'querystring';
import Multer from 'multer';
import {uuid} from 'uuidv4';
import firebaseAdmin from 'firebase-admin';

const router = express.Router();

const firebaseStorageBucket = firebaseAdmin.storage().bucket();

require('../../../models/profiles');
const ProfileModel : Model<IProfile> = mongoose.model<IProfile>("profiles");

const multer = Multer({
    storage : Multer.memoryStorage(),
    limits : {
        fileSize : 50 * 1024 * 1024
    }
});

//Create profile controller 
router.post('/', async (req : Request, res : Response) => {
    res.send('profile post');
});

//Get profile controller
router.get('/:username', passport.authenticate('jwt', { session: false }), async (req : Request, res : Response) => {

    const head = req.query.head;
    const username : string = req.params.username;

    if(head && head === '1'){
        try{
            const profileResult : IProfile = await ProfileModel.findOne({username}).select('username firstname lastname profileImage').exec();
            const responseData : any = {
                username : profileResult.username,
                firstname : profileResult.firstname,
                lastname : profileResult.lastname,
                profileImage : profileResult.profileImage
            }
            res.status(200).send(responseData);
        }catch(err){
            res.status(500).send(err);
        }
    }else{
        try{
            const profileResult : IProfile = await ProfileModel.findOne({username}).exec();

            if(!profileResult){
                res.status(404).send({error : "profile not found"});
                return;
            }
        
            //console.log(profileResult);
            interface IProfileResponse {
                username : string,
                email : string,
                firstname : string,
                lastname : string,
                phone : string,
                createdAt : Date,
                profileImage : string
            }
        
            const responseData : IProfileResponse = {
                username : profileResult.username,
                email : profileResult.email,
                firstname : profileResult.firstname,
                lastname : profileResult.lastname,
                phone : profileResult.phone,
                createdAt : profileResult.createdAt,
                profileImage : profileResult.profileImage
            }
        
            res.status(200).send(responseData);
        }catch(err){
            res.status(500).send(err);
        }
    }
});

//Update username controller
router.put('/username', async (req : Request, res : Response) => {
    res.send('profile username put');
});

//Update name controller
router.put('/name', async (req : Request, res : Response) => {
    res.send('profile name put');
});

//Delete profile controller
router.delete('/', async (req : Request, res : Response) => {
    res.send('profile delete');
});

//Get profile image
router.get('/profileImg/:username', passport.authenticate('jwt', { session: false }), async (req : Request, res : Response) => {
    const username : string = req.params.username;
    
    const profileImageResult = await ProfileModel.findOne({username}).select('profileImage').exec();
    //console.log(profileImageResult.profileImage);
    
    res.send({profileImage : profileImageResult.profileImage});
});

router.put('/profileImg/', passport.authenticate('jwt', {session : false}), multer.single('file'), async (req : Request, res : Response) => {
    const {username} = req.body;
    console.log(req.body);
    const user : any = req.user;
    const file : any = req.file;

    if(!file){
        return res.status(400).send('action not possible');
    }
    
    if(username !== user.username){
        res.status(400).send('action not possible');
    }

    try{
        const url : any = await uploadImageToStorage(file, user.username);
        const profileResult : IProfile = await ProfileModel.findById({_id : user._id}).exec();
        if(!profileResult){
            return res.status(400).send('profile not present');
        }
        //Delete old profile image
        deleteImageFromStorage(profileResult.profileImage);
        
        //Add new image url
        profileResult.profileImage = url;
        const profileImageResult = await profileResult.save();
        res.send({profileImage : profileImageResult.profileImage});
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    }
});

const deleteImageFromStorage = (url : string) => {
    if(!url || url.length === 0) return;
    console.log(url);
    let decodedURL = decodeURIComponent(url);
    let filename = decodedURL.slice(decodedURL.indexOf('/o/')+3, decodedURL.indexOf('?'));
    firebaseStorageBucket.file(filename).delete().then().catch();
}

const uploadImageToStorage = async (file : any, username : any) : Promise<string> => {
    return new Promise((resolve : any, reject : any) => {
        if(!file){
            reject('no image file');
        }

        const _uuid = uuid();

        let newFilename = `profile/ML_${username}_${Date.now()}.${file.originalname.split('.').pop()}`;
        
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

module.exports = router;