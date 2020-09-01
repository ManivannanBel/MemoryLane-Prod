import { GET_ERROR } from '../actions/types';

interface IError {
    message : string
}

const initialState : IError = {
    message : ''
}

export default (state : any = initialState, actions : any) => {
    switch(actions.type){
        case GET_ERROR:
            return {
                ...state,
                message : actions.payload
            }
            break;
        default:
            return state;            
    }
}