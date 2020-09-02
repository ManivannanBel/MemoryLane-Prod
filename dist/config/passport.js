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
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const passport_jwt_1 = require("passport-jwt");
const mongoose_1 = __importDefault(require("mongoose"));
const keys = require('./keys');
const ProfileModel = mongoose_1.default.model('profiles');
let opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.secretOrKey
};
module.exports = (passport) => {
    passport.use(new passport_google_oauth20_1.Strategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/api/v0/auth/google/callback',
        proxy: true
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        const profileImage = profile.photos ? (profile.photos[0].value) : '';
        const timestamp = new Date().getTime().toString();
        const username = `${profile.name.givenName}_${profile.name.familyName}_${timestamp.substring(timestamp.length - 4, timestamp.length)}`.toLowerCase();
        const newProfile = {
            username,
            googleId: profile.id,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            profileImage
        };
        try {
            //Check for existing user
            const profileResult = yield ProfileModel.findOne({ googleId: profile.id });
            if (profileResult) {
                //return user
                done(null, profileResult);
            }
            else {
                //Check if the user has already registered with facebook auth
                const checkProfileResult = yield ProfileModel.findOne({ email: profile.emails[0].value });
                if (checkProfileResult) {
                    //If that fucker already had logged in using facebook, then just update the googleID in db
                    const newProfileResult = yield ProfileModel.findOneAndUpdate({ email: profile.emails[0].value }, { googleId: profile.id });
                    done(null, newProfileResult);
                }
                else {
                    //create new profile
                    const newProfileResult = yield new ProfileModel(newProfile).save();
                    done(null, newProfileResult);
                }
            }
        }
        catch (err) {
            console.log(err);
            done(err, null);
        }
    })));
    passport.use(new passport_facebook_1.Strategy({
        clientID: keys.FACEBOOK_APP_ID,
        clientSecret: keys.FACEBOOK_APP_SECRET,
        callbackURL: "/api/v0/auth/facebook/callback",
        profileFields: ['id', 'email', 'first_name', 'last_name', 'picture.type(large)']
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        const profileImage = profile.photos ? (profile.photos[0].value) : '';
        const timestamp = new Date().getTime().toString();
        const username = `${profile.name.givenName}_${profile.name.familyName}_${timestamp.substring(timestamp.length - 4, timestamp.length)}`.toLowerCase();
        const newProfile = {
            username,
            facebookId: profile.id,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            profileImage
        };
        try {
            //Check for existing user
            const profileResult = yield ProfileModel.findOne({ facebookId: profile.id });
            if (profileResult) {
                console.log('oauth found');
                //return user
                done(null, profileResult);
            }
            else {
                console.log('oauth not found');
                //Check if the user has already registered with google auth
                try {
                    const checkProfileResult = yield ProfileModel.findOne({ email: profile.emails[0].value });
                    if (checkProfileResult) {
                        console.log('oauth exist');
                        //If that fucker already had logged in using facebook, then just update the googleID in db
                        try {
                            const newProfileResult = yield ProfileModel.findOneAndUpdate({ email: profile.emails[0].value }, { facebookId: profile.id });
                            done(null, newProfileResult);
                        }
                        catch (err) {
                            console.log(err);
                            done(err, null);
                        }
                    }
                    else {
                        console.log('oauth created');
                        //create new profile
                        try {
                            const newProfileResult = yield new ProfileModel(newProfile).save();
                            done(null, newProfileResult);
                        }
                        catch (err) {
                            console.log(err);
                            done(err, null);
                        }
                    }
                }
                catch (err) {
                    console.log(err);
                    done(err, null);
                }
            }
        }
        catch (err) {
            console.log(err);
            done(err, null);
        }
    })));
    passport.use(new passport_jwt_1.Strategy(opts, (jwt_payload, done) => {
        ProfileModel.findById(jwt_payload.id)
            .then((profile) => {
            if (profile) {
                done(null, profile);
            }
            else {
                done(null, false);
            }
        })
            .catch(err => {
            console.log(err);
        });
    }));
};
//# sourceMappingURL=passport.js.map