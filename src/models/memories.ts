import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { IMemory } from '../types/modelTypes';

const memorySchema = new Schema({
    moment : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'moments'
    },
    owner : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'profiles'
    },
    memory : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    isActive : {
        type : Boolean,
        required : true,
        default : true
    }
});

// memorySchema.method('transform', () => {
//     let obj = this.toObject();
    
//     obj.id = obj._id;
//     delete obj._id;

//     return obj;
// });

// memorySchema.method('transform', function() {
//     var obj = this.toObject();
 
//     //Rename fields
//     obj.id = obj._id;
//     delete obj._id;
 
//     return obj;
// });

module.exports = mongoose.model<IMemory>("memories", memorySchema);