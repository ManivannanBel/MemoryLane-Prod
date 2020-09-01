import { CREATE_MOMENT, GET_USER_MOMENTS, CLEAR_USER_MOMENTS, DELETE_USER_MOMENTS, UPDATE_USER_MOMENTS, GET_USER_SEARCH_RESULT } from '../actions/types';
import { IMomentResponse } from '../types/responseTypes/moment';

const initialState = {
    userMoments : new Map<string, IMomentResponse>(),
    userSearchResult : new Array<any>()
    // updating : false,
    // updated : false 
}

export default (state : any = initialState, actions : any) => {
    switch(actions.type){
        case CREATE_MOMENT:
            return {
                ...state,
                userMoments : createMoment(actions.payload, state.userMoments)
            }
        case GET_USER_MOMENTS:
            return {
                ...state,
                userMoments : getMoments(actions.payload, state.userMoments)
            }
        case  DELETE_USER_MOMENTS:
            return {
                ...state,
                userMoments : deleteMoment(actions.payload, state.userMoments)
            }
        case UPDATE_USER_MOMENTS:
            return {
                ...state,
                userMoments : updateMoment(actions.payload, state.userMoments),
                // updated : true,
                // updating : false
            }
        case CLEAR_USER_MOMENTS:
            return {
                ...state,
                userMoments : new Map()
            }
        case GET_USER_SEARCH_RESULT:
            return {
                ...state,
                userSearchResult : actions.payload
            }
        default:
            return state;
    }
}

const createMoment = (payload : IMomentResponse, userMoment : any) => {
    //const tUserMoment : any = {}
    //tUserMoment.moments = [payload, ...userMoment.moments]
    const newUserMoment : Map<string, IMomentResponse> = userMoment;
    newUserMoment.set(payload.id, payload);
    return new Map(newUserMoment);
}

const getMoments = (payload : Array<IMomentResponse>, userMoment : any) => {
    const newUserMoment : Map<string, IMomentResponse> = userMoment;
    payload.map(moment => {
        newUserMoment.set(moment.id, moment);
    })
    return new Map(newUserMoment);
} 

const updateMoment = (payload : IMomentResponse, userMoment : any) => {
    const newUserMoment : Map<string, IMomentResponse> = userMoment;
    newUserMoment.set(payload.id, payload);
    return new Map(newUserMoment);
}

const deleteMoment = (payload : any, userMoment : any) => {
    const newUserMoment : Map<string, IMomentResponse> = userMoment;
    newUserMoment.delete(payload.momentId);
    return new Map(newUserMoment);
}

