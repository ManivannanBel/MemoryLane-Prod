import { IPerson } from './moment';

export interface IMemoriesResponse {
    moment : string,
    memories : Array<IMemoryResponse>
}

export interface IMemoryResponse {
    id : string,
    owner : IPerson,
    memory : string,
    createdAt : Date
}