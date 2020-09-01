import { Document } from 'mongoose';
import { IPerson } from './responseTypes';

export interface IProfile extends Document{
    username : string,
    firstname : string,
    lastname :  string,
    email : string,
    phone : string,
    password : string,
    confirmationCode : string,
    createdAt : Date,
    isActive : boolean,
    verified : boolean,
    googleId : string,
    facebookId : string,
    profileImage : string
}

export interface IMoment extends Document{
    ownerId : string | IPerson,
    title : string,
    description : string,
    date : Date,
    createdAt : Date,
    group : Array<String>,
    isActive : boolean
}

export interface IMomentFile extends Document{
    momentId : string,
    url : Array<string>
}

export interface IMemory extends Document{
    moment : string,
    owner : string | IPerson,
    memory : string,
    createdAt : Date,
    isActive : boolean
}

export interface IRelationship extends Document{
    user1 : string | IPerson,
    user2 : string | IPerson,
    status : number,
    actionUser : string | IPerson
}
