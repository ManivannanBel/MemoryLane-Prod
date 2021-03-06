import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { IMoment } from '../types/modelTypes';

const momentSchema = new Schema({
    ownerId : {
        type : mongoose.Types.ObjectId,
        ref : 'profiles',
        required : true
    },
    title : {
        type : String
    },
    description : {
        type : String
    },
    images : {
        type : [String]
    },
    date : {
        type : Date,
        default : Date.now,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now,
        required : true
    },
    visibility : {
        //0 private(only to friends)
        //1 public(every user)
        type : Number,
        default : 0
    },
    group : {
        type : [mongoose.Types.ObjectId]
    },
    isActive : {
        type : Boolean,
        required : true,
        default : true
    }
});

mongoose.model<IMoment>('moments', momentSchema);