import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { IProfile } from '../types/modelTypes';

const profileSchema = new Schema({
    username : {
        type : String,
        unique : true,
        required : true
    },
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    phone : {
        type : String,
    },
    password : {
        type : String,
    },
    confirmationCode : {
        type : String,
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    isActive : {
        type : Boolean,
        default : true,
        required : true
    },
    verified : {
        type : Boolean,
        default : false,
        required : true
    },
    googleId : {
        type : String
    },
    facebookId : {
        type : String
    },
    profileImage : {
        type : String
    }
});

mongoose.model<IProfile>('profiles', profileSchema);