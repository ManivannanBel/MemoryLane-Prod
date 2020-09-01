import { LOAD_MEMORY_LANE } from '../actions/types';
 
const initialState = {
    moments : []
}

export default (state : any = initialState, actions : any) => {
    switch(actions.type){
        case LOAD_MEMORY_LANE:
            return {
                ...state,
                moments : actions.payload
            }
        default:
            return state;
    }
}

const loadMoments = (moments : any, state : any) => {
    let temp = state.moments;
    temp = [...temp, ...moments];
    return temp;
}