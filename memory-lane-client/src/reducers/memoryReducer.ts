import { GET_MEMORIES, CREATE_MEMORY } from '../actions/types';
import { IMemoryResponse, IMemoriesResponse } from '../types/responseTypes/memory';

const initialState = {
                    //momentId => (memoryId, memory)
    memoriesMap : new Map<string, Map<string, IMemoryResponse>>()
}

export default (state : any = initialState, actions : any) => {
    switch(actions.type){
        case CREATE_MEMORY:
            return {
                ...state,
                memoriesMap : createMemory(actions.payload, state)
            }
        case GET_MEMORIES:
            return {
                ...state,
                memoriesMap : getMemories(actions.payload, state)
            }
        default:
            return state;
    }
}

const createMemory = (payload : any, state : any) => {
    const newMemory: IMemoryResponse = payload.memory

    let memories  : Map<string, IMemoryResponse> = state.memoriesMap.get(payload.moment);
    if(memories){
        memories.set(newMemory.id, newMemory);
    }else{
        memories = new Map([[newMemory.id, newMemory]]);
    }

    let newMemoriesMap : Map<string, Map<string, IMemoryResponse>> = state.memoriesMap;
    newMemoriesMap.set(payload.moment, memories);
    console.log(newMemoriesMap)
    return new Map(newMemoriesMap);
}

const getMemories = (payload : IMemoriesResponse, state : any) => {
    const memoriesPayload : Array<IMemoryResponse> = payload.memories;
    console.log(memoriesPayload);
    const newMemoriesMap : Map<string, Map<string, IMemoryResponse>> = state.memoriesMap;
    let memories : Map<string, IMemoryResponse> = state.memoriesMap.get(payload.moment);
    if(!memories){
        memories = new Map();
    }
    for(const memory of memoriesPayload){
        memories.set(memory.id, memory);
    }
    //memories = Array(...memories, ...memoriesPayload);
    newMemoriesMap.set(payload.moment, memories);
    console.log(newMemoriesMap);
    return new Map(newMemoriesMap);
}