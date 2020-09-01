import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { IMomentFile } from '../types/modelTypes';

const momentFileSchema = new Schema({
    momentId : {
        type : mongoose.Types.ObjectId,
        ref : 'moments',
        required : true
    },
    url : [String]
});

module.exports = mongoose.model<IMomentFile>('momentFiles', momentFileSchema);