import { CREATE_MEMORY, GET_MEMORIES } from './types';
import { Dispatch } from 'redux';
import axios from 'axios';
import { ICreateMemory } from '../types/requestPayloads/memory'; 
import { IMemoryResponse, IMemoriesResponse } from '../types/responseTypes/memory';

export const createMemory = ( memory : ICreateMemory, momentId : string ) => async (dispatch : Dispatch) => {
    try{
        const memoryResponse = await axios.post(`/api/v0/M/m/${momentId}`, memory);
        //console.log(memoryResponse);
        
        const _memory : IMemoryResponse = {
            id : memoryResponse.data.memory.id,
            owner : memoryResponse.data.memory.owner,
            memory : memoryResponse.data.memory.memory,
            createdAt : memoryResponse.data.memory.createdAt
        } 

        const memoryPayload = {
            moment : memoryResponse.data.moment,
            memory : _memory
        }

        dispatch({
            type : CREATE_MEMORY,
            payload : memoryPayload
        })
    }catch(err){
        console.log(err);
    }
}

export const getMemories = ( moment : string ) => async (dispatch : Dispatch) => {
    try{
        const memoriesResponse = await axios.get(`/api/v0/M/m/${moment}`);
        //console.log(memoriesResponse.data);   
        const memoriesPayload : IMemoriesResponse = memoriesResponse.data;
        //console.log(memoriesPayload);
        dispatch({
            type : GET_MEMORIES,
            payload : memoriesPayload
        })
    }catch(err){    
        console.log(err);
    }
}