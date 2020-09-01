import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { IRelationship } from '../types/modelTypes';

const RelationshipSchema = new Schema({
    user1 : {
        //smaller id by comparision
        type : mongoose.Types.ObjectId,
        ref : 'profiles',
        required : true
    },
    user2 : {
        //greater id by comparision
        type : mongoose.Types.ObjectId,
        ref : 'profiles',
        required : true
    },
    status : {
        //0	Pending
        //1	Accepted
        //2	Declined
        //3	Blocked
        type : Number,
        required : true
    },
    actionUser : {
        //Who performed the last action
        type : mongoose.Types.ObjectId,
        ref : 'profiles',
        required : true
    },
    date : {
        //when request is sent?, when was friended? 
        type : Date,
        required : true,
        default : Date.now
    }
});

RelationshipSchema.index({'user1' : 1, 'user2' : 1}, {unique : true});

module.exports = mongoose.model<IRelationship>('relationships', RelationshipSchema);