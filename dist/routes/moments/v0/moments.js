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
const multer_1 = __importDefault(require("multer"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const uuidv4_1 = require("uuidv4");
const firebaseStorageBucket = firebase_admin_1.default.storage().bucket();
const router = express_1.default.Router();
require('../../../models/moments');
const MomentModel = mongoose_1.default.model("moments");
require('../../../models/momentFiles');
const MomentFileModel = mongoose_1.default.model("momentFiles");
require('../../../models/profiles');
const ProfileModel = mongoose_1.default.model("profiles");
require('../../../models/memories');
const MemoriesModel = mongoose_1.default.model("memories");
const multer = multer_1.default({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});
//Moment creation controller
router.post('/', passport_1.default.authenticate('jwt', { session: false }), multer.fields([{ name: 'body', maxCount: 1 }, { name: 'file', maxCount: 10 }]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.body);
    const { title, description, date } = req.body;
    console.log(req.body);
    console.log(req.body.group);
    const user = req.user;
    //console.log(user);
    //User ID to Store in DB
    const groupId = [];
    //User details to send in response
    const groupRes = [];
    //if response contains group data
    if (req.body.group !== '') {
        const group = JSON.parse(req.body.group);
        for (const uname of group) {
            const profileResult = yield ProfileModel.findOne({ username: uname }).select('_id firstname lastname username profileImage').exec();
            if (profileResult) {
                groupId.push(profileResult._id);
                const person = {
                    firstname: profileResult.firstname,
                    lastname: profileResult.lastname,
                    username: profileResult.username,
                    profilePic: profileResult.profileImage
                };
                groupRes.push(person);
            }
        }
    }
    const newMoment = {
        ownerId: user.id,
        title,
        description,
        date,
        createdAt: new Date(),
        group: groupId,
        isActive: true
    };
    const moment = yield new MomentModel(newMoment).save();
    const firstname = user.firstname;
    const lastname = user.lastname;
    const username = user.username;
    const profilePic = user.profileImage;
    const momentResponse = {
        id: moment.id,
        title: moment.title,
        description: moment.description,
        group: groupRes,
        files: [],
        date: moment.date,
        createdAt: moment.createdAt,
        owner: { firstname, lastname, username, profilePic }
    };
    if (!(req.files.file) || req.files.file.length === 0) {
        return res.send(momentResponse);
    }
    const momentId = moment.id;
    const files = req.files.file;
    const uploadFilesPromise = files.map((file) => {
        try {
            return uploadImageToStorage(file, user.username);
        }
        catch (err) {
            console.log(err);
        }
    });
    try {
        const urls = yield Promise.all(uploadFilesPromise);
        const newMomentFile = {
            momentId,
            url: urls
        };
        const uploadedFiles = yield new MomentFileModel(newMomentFile).save();
        momentResponse.files = uploadedFiles.url;
        res.send(momentResponse);
    }
    catch (err) {
        console.log(err);
    }
}));
router.post('/upload/:momentId', passport_1.default.authenticate('jwt', { session: false }), multer.array('file', 10), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.files === null) {
        return res.status(400).json({ msg: 'no files found' });
    }
    const momentId = req.params.momentId;
    //console.log(typeof(req.files));
    const files = req.files;
    const user = req.user;
    const uploadPromise = files.map((file) => {
        try {
            return uploadImageToStorage(file, user.username);
        }
        catch (err) {
            console.log(err);
        }
    });
    try {
        const urls = yield Promise.all(uploadPromise);
        //console.log('end');
        const newMomentFile = {
            momentId,
            url: urls
        };
        const result = yield new MomentFileModel(newMomentFile).save();
        res.send(result);
    }
    catch (err) {
        console.log(err);
        res.send(err);
    }
}));
const uploadImageToStorage = (file, username) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('no image file');
        }
        const _uuid = uuidv4_1.uuid();
        let newFilename = `moment/ML_${username}_${Date.now()}.${file.originalname.split('.').pop()}`;
        let fileToUpload = firebaseStorageBucket.file(newFilename);
        const blobStream = fileToUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                firebaseStorageDownloadTokens: _uuid
            }
        });
        blobStream.on('error', (error) => {
            reject('Something wrong in uploading file');
        });
        blobStream.on('finish', () => {
            const url = `https://firebasestorage.googleapis.com/v0/b/${firebaseStorageBucket.name}/o/${encodeURIComponent(fileToUpload.name)}?alt=media&token=${_uuid}`;
            resolve(url);
        });
        blobStream.end(file.buffer);
    });
});
//Get moment controller 
router.get('/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    try {
        const ownerDetails = yield ProfileModel.findOne({ username: username }).select("_id username firstname lastname profileImage").exec();
        let results = yield MomentModel.find({ ownerId: ownerDetails._id }).sort("-date").exec();
        //console.log(results);
        //console.log("jjj");
        const responseArray = [];
        const firstname = ownerDetails.firstname;
        const lastname = ownerDetails.lastname;
        const profilePic = ownerDetails.profileImage;
        //console.log(profilePic);
        for (let i = 0; i < results.length; i++) {
            const images = yield MomentFileModel.findOne({ momentId: results[i]._id }).select('url -_id').exec();
            //console.log(images.url);
            let urls = [];
            if (images) {
                urls = images.url;
            }
            //results[i].url = (urls);
            console.log(results[i]);
            const groupIds = results[i].group;
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
                id: results[i].id,
                title: results[i].title,
                description: results[i].description,
                group: group,
                files: urls,
                date: results[i].date,
                createdAt: results[i].createdAt,
                owner: { firstname, lastname, username, profilePic }
            };
            responseArray.push(response);
        }
        //console.log(results);
        res.send({ moments: responseArray });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}));
//Update moment controller
router.put('/:momentId', passport_1.default.authenticate('jwt', { session: false }), multer.array('file', 10), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = req.body;
    // console.log(req.body);
    // console.log(req.body.existingUrls);
    // console.log(typeof(req.body.existingUrls));
    const existingUrls = JSON.parse(req.body.existingUrls);
    const filesRemoved = JSON.parse(req.body.filesRemoved);
    // console.log(existingUrls);
    // console.log(typeof(existingUrls));
    const { momentId } = req.params;
    const user = req.user;
    const newFiles = req.files;
    try {
        // console.log(momentId);
        // console.log(user._id);
        const moment = yield MomentModel.findOne({ _id: momentId, ownerId: user._id }).exec();
        if (!moment) {
            return res.status(400).send("not updated");
        }
        //update moment title, description, groups
        const updatedMoment = yield MomentModel.findOneAndUpdate({ _id: momentId, ownerId: user._id }, { title, description }, { new: true }).exec();
        //console.log(updatedMoment);
        let newUrls = [];
        //if new images are added then upload the files and get the urls
        // console.log(newFiles.length);
        // console.log(Array.isArray(newFiles));
        if (newFiles && newFiles.length > 0) {
            const uploadPromise = newFiles.map((file) => {
                try {
                    return uploadImageToStorage(file, user.username);
                }
                catch (err) {
                    console.log(err);
                }
            });
            newUrls = yield Promise.all(uploadPromise);
            console.log(newUrls);
        }
        //update urls list
        // console.log('1-----');
        // console.log(existingUrls);
        // console.log('2-----');
        // console.log(newUrls);
        const urls = [...existingUrls, ...newUrls];
        // console.log('----');
        // console.log(urls);
        const updatedFiles = yield MomentFileModel.findOneAndUpdate({ momentId }, { url: urls }, { new: true }).exec();
        //delete the removed files from storage
        // console.log(filesRemoved);
        // console.log(Array.isArray(filesRemoved));
        // console.log(typeof(filesRemoved));
        filesRemoved.map((url) => {
            let decodedURL = decodeURIComponent(url);
            let filename = decodedURL.slice(decodedURL.indexOf('/o/') + 3, decodedURL.indexOf('?'));
            firebaseStorageBucket.file(filename).delete().then().catch();
        });
        //create response
        const { firstname, lastname, username, profileImage } = user;
        const response = {
            id: updatedMoment.id,
            title: updatedMoment.title,
            description: updatedMoment.description,
            group: updatedMoment.group,
            files: updatedFiles.url,
            date: updatedMoment.date,
            createdAt: updatedMoment.createdAt,
            owner: { firstname, lastname, username, profilePic: profileImage }
        };
        // console.log('res-------');
        // console.log(response);
        res.send(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
    //res.send('update moment');
}));
//Delete moment controller
router.delete('/:momentId', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { momentId } = req.params;
    const user = req.user;
    console.log(user._id);
    try {
        console.log(`{_id : '${momentId}', ownerId : '${user._id}'}`);
        const moment = yield MomentModel.findOne({ _id: momentId, ownerId: user._id }).exec();
        // console.log(moment);
        if (!moment) {
            return res.status(400).send('no such moment found');
        }
        const files = yield MomentFileModel.findOne({ momentId: momentId }).exec();
        console.log(files);
        let urls = [];
        if (files) {
            urls = files.url;
            urls.map(url => {
                console.log(url);
                let decodedURL = decodeURIComponent(url);
                let filename = decodedURL.slice(decodedURL.indexOf('/o/') + 3, decodedURL.indexOf('?'));
                firebaseStorageBucket.file(filename).delete().then().catch();
            });
            files.remove().then(() => moment.remove().then());
        }
        MemoriesModel.deleteMany({ moment: momentId }).exec();
        MomentModel.findOneAndDelete({ _id: momentId }).exec();
        res.send("deleted");
    }
    catch (err) {
        console.log("in delete");
        console.log(err);
        res.status(500).send('failed');
    }
}));
module.exports = router;
//# sourceMappingURL=moments.js.map