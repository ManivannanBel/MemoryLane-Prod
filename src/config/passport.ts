import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import passport, {Profile} from 'passport';
import mongoose, {Document, Model} from 'mongoose';
import { IProfile } from '../types/modelTypes';

const keys = require('./keys');
const ProfileModel : Model<IProfile> = mongoose.model('profiles');
let opts : StrategyOptions = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : keys.secretOrKey
};


module.exports = (passport : any) => {
   
    passport.use(
       new GoogleStrategy({
           clientID : keys.googleClientID,
           clientSecret : keys.googleClientSecret,
           callbackURL : '/api/v0/auth/google/callback',
           proxy : true
       }, async (accessToken, refreshToken, profile : Profile, done) => {
        
        const profileImage : String = profile.photos ? (profile.photos[0].value) : '';
        const timestamp : String = new Date().getTime().toString();
        const username : String = `${profile.name.givenName}_${profile.name.familyName}_${timestamp.substring(timestamp.length - 4, timestamp.length)}`.toLowerCase();
        
        const newProfile = {
            username,
            googleId : profile.id,
            firstname : profile.name.givenName,
            lastname : profile.name.familyName,
            email : profile.emails[0].value,
            profileImage
        }

        try{
            //Check for existing user
            const profileResult : Document = await ProfileModel.findOne({googleId : profile.id});
            if(profileResult){
                //return user
                done(null, profileResult);
            }else{
                    //Check if the user has already registered with facebook auth
                    const checkProfileResult : Document = await ProfileModel.findOne({email : profile.emails[0].value});
                    if(checkProfileResult){
                        //If that user already had logged in using facebook, then just update the googleID in db
                        const newProfileResult :Document = await ProfileModel.findOneAndUpdate({email : profile.emails[0].value}, {googleId : profile.id});
                        done(null, newProfileResult);                        
                    }else{
                        //create new profile
                        const newProfileResult :Document = await new ProfileModel(newProfile).save();
                        done(null, newProfileResult);
                    }
            }
        } catch (err) {
            console.log(err);
            done(err, null);
        }
    })
   );
   
   passport.use(
       new FacebookStrategy({
        clientID: keys.FACEBOOK_APP_ID,
        clientSecret: keys.FACEBOOK_APP_SECRET,
        callbackURL: "/api/v0/auth/facebook/callback",
        profileFields : ['id', 'email', 'first_name', 'last_name', 'picture.type(large)']
       }, async (accessToken, refreshToken, profile : Profile, done) => {
        
            const profileImage : String = profile.photos ? (profile.photos[0].value) : '';
            const timestamp : String = new Date().getTime().toString();
            const username : String = `${profile.name.givenName}_${profile.name.familyName}_${timestamp.substring(timestamp.length - 4, timestamp.length)}`.toLowerCase();
            
            const newProfile = {
                username,
                facebookId : profile.id,
                firstname : profile.name.givenName,
                lastname : profile.name.familyName,
                email : profile.emails[0].value,
                profileImage
            }

            try{
                //Check for existing user
                const profileResult = await ProfileModel.findOne({facebookId : profile.id});
                if(profileResult){
                    console.log('oauth found');
                    
                    //return user
                    done(null, profileResult);
                }else{
                    console.log('oauth not found');
                        //Check if the user has already registered with google auth
                        try{
                            const checkProfileResult = await ProfileModel.findOne({email : profile.emails[0].value});
                            if(checkProfileResult){
                                console.log('oauth exist');
                                //If that user already had logged in using facebook, then just update the googleID in db
                                try{
                                    const newProfileResult = await ProfileModel.findOneAndUpdate({email : profile.emails[0].value}, {facebookId : profile.id});
                                    done(null, newProfileResult);                        
                                }catch(err){
                                    console.log(err);
                                    done(err, null);
                                }

                            }else{
                                console.log('oauth created');
                                //create new profile
                                try{
                                    const newProfileResult = await new ProfileModel(newProfile).save();
                                    done(null, newProfileResult);
                                }catch(err){
                                    console.log(err);
                                    done(err, null);
                                }

                            }   
                        }catch(err){
                            console.log(err);
                            done(err, null);
                        }

                }
            } catch (err) {
                console.log(err);
                done(err, null);
            }
       })
   );

   passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
       ProfileModel.findById(jwt_payload.id)
                    .then((profile : IProfile) => {
                        if(profile){
                            done(null, profile);
                        }else{
                            done(null, false);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
   }));
}