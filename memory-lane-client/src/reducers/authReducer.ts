import { FETCH_USER } from '../actions/types';

interface IAuth {
    isAuth : boolean,
    username : string,
    id : string
}


const initialState : IAuth = {
    isAuth : false,
    username : '',
    id : ''
}

export default (state : any = initialState, actions : any) => {
    switch(actions.type){
        case FETCH_USER :
            //console.log(actions);
            return {
                ...state,
                isAuth : actions.payload.isAuth,
                username : actions.payload.username,
                id : actions.payload.id
            }
        break;
        default: 
            return state;
    }
}