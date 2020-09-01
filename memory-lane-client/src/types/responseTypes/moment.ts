export interface IMomentResponse {
    id : string,
    title : string,
    description : string,
    group : Array<string>,
    files : Array<string>,
    date : Date,
    owner : IPerson
}

export interface IPerson {
    fullname : string,
    username : string,
    profilePic : string
}
