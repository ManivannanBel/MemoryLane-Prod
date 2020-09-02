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
const uuidv4_1 = require("uuidv4");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const router = express_1.default.Router();
const firebaseStorageBucket = firebase_admin_1.default.storage().bucket();
require('../../../models/profiles');
const ProfileModel = mongoose_1.default.model("profiles");
const multer = multer_1.default({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});
//Create profile controller 
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('profile post');
}));
//Get profile controller
router.get('/:username', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const head = req.query.head;
    const username = req.params.username;
    if (head && head === '1') {
        try {
            const profileResult = yield ProfileModel.findOne({ username }).select('username firstname lastname profileImage').exec();
            const responseData = {
                username: profileResult.username,
                firstname: profileResult.firstname,
                lastname: profileResult.lastname,
                profileImage: profileResult.profileImage
            };
            res.status(200).send(responseData);
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
    else {
        try {
            const profileResult = yield ProfileModel.findOne({ username }).exec();
            if (!profileResult) {
                res.status(404).send({ error: "profile not found" });
                return;
            }
            const responseData = {
                username: profileResult.username,
                email: profileResult.email,
                firstname: profileResult.firstname,
                lastname: profileResult.lastname,
                phone: profileResult.phone,
                createdAt: profileResult.createdAt,
                profileImage: profileResult.profileImage
            };
            res.status(200).send(responseData);
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
}));
//Update username controller
router.put('/username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('profile username put');
}));
//Update name controller
router.put('/name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('profile name put');
}));
//Delete profile controller
router.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('profile delete');
}));
//Get profile image
router.get('/profileImg/:username', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    const profileImageResult = yield ProfileModel.findOne({ username }).select('profileImage').exec();
    //console.log(profileImageResult.profileImage);
    res.send({ profileImage: profileImageResult.profileImage });
}));
router.put('/profileImg/', passport_1.default.authenticate('jwt', { session: false }), multer.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    console.log(req.body);
    const user = req.user;
    const file = req.file;
    if (!file) {
        return res.status(400).send('action not possible');
    }
    if (username !== user.username) {
        res.status(400).send('action not possible');
    }
    try {
        const url = yield uploadImageToStorage(file, user.username);
        const profileResult = yield ProfileModel.findById({ _id: user._id }).exec();
        if (!profileResult) {
            return res.status(400).send('profile not present');
        }
        //Delete old profile image
        deleteImageFromStorage(profileResult.profileImage);
        //Add new image url
        profileResult.profileImage = url;
        const profileImageResult = yield profileResult.save();
        res.send({ profileImage: profileImageResult.profileImage });
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
const deleteImageFromStorage = (url) => {
    if (!url || url.length === 0)
        return;
    console.log(url);
    let decodedURL = decodeURIComponent(url);
    let filename = decodedURL.slice(decodedURL.indexOf('/o/') + 3, decodedURL.indexOf('?'));
    firebaseStorageBucket.file(filename).delete().then().catch();
};
const uploadImageToStorage = (file, username) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('no image file');
        }
        const _uuid = uuidv4_1.uuid();
        let newFilename = `profile/ML_${username}_${Date.now()}.${file.originalname.split('.').pop()}`;
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
module.exports = router;
//# sourceMappingURL=profiles.js.map