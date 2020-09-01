import { GET_PROFILE_DATA, GET_PROFILE_IMAGE } from '../actions/types';

interface IProfile{
    username : string,
    email : string,
    firstname : string,
    lastname : string,
    phone : string,
    createdAt : Date,
    profileImage : string
}

const initialState : IProfile = {
    username : '',
    email : '',
    firstname : '',
    lastname : '',
    phone : '',
    createdAt : new Date(),
    profileImage : ''
};

export default (state : any = initialState, actions : any) => {
    switch(actions.type){
        case GET_PROFILE_DATA : 
            return {
                ...state,
                username : actions.payload.username,
                email : actions.payload.email,
                firstname : actions.payload.firstname,
                lastname : actions.payload.lastname,
                phone : actions.payload.phone,
                createdAt : actions.payload.createdAt,
                profileImage : actions.payload.profileImage
            }
        break;
        case GET_PROFILE_IMAGE:
            return {
                ...state,
                profileImage : actions.payload.profileImage
            }
        default: 
            return state;
    }
}