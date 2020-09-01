import { GET_RELATIONSHIP_STATUS } from '../actions/types';

const initState = {
    relationshipStatus : {}
}

export default (state : any = initState, actions : any) => {
    switch(actions.type){
        case GET_RELATIONSHIP_STATUS:
            return {
                ...state,
                relationshipStatus : getStatus(actions.payload)
            }
            default:
                return state;
    }
}

const getStatus = (payload : any) => {
    switch(payload.status){
        case -1:
            return {status : "NotFriends"};
        case 0:
            return {status : "Pending", userAction : payload.userAction};
        case 1:
            return {status : "Accepted", userAction : payload.userAction};
        case 2:
            return {status : "Declined", userAction : payload.userAction};
        case 3:
            return {status : "Blocked", userAction : payload.userAction};
    }
}

