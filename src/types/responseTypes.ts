export interface IMomentResponse {
    id : string,
    title : string,
    description : string,
    group : Array<any>,
    files : Array<string>,
    date : Date,
    createdAt : Date,
    owner : IPerson
}

export interface IPerson {
    firstname : string,
    lastname : string,
    username : string,
    profilePic : string
}

export interface IMemoryResponse {
    id : string,
    owner : IPerson,
    memory : string,
    createdAt : Date
}