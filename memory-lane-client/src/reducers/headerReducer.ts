import { SHOW_LOGIN_PANEL, SHOW_REGISTER_PANEL, CLOSE_LOGIN_REGISTER_PANEL, GET_USER_DETAILS_HEADER, GET_SEARCH_RESULTS } from '../actions/types';

interface IHeaderState {
    showLoginPanel : boolean,
    showRegisterPanel : boolean,
    username : string,
    profileImage : string,
    searchResults : Array<any>
}

const initialState : IHeaderState = {
    showLoginPanel : false,
    showRegisterPanel : false,
    username : '',
    profileImage : '',
    searchResults : []
}

export default (state : any = initialState, actions : any) => {
    switch(actions.type){
        case SHOW_LOGIN_PANEL:
            return {
                ...state,
                showLoginPanel : true,
                showRegisterPanel : false
            }
        case SHOW_REGISTER_PANEL:
            return {
                ...state,
                showLoginPanel : false,
                showRegisterPanel : true
            }
        case CLOSE_LOGIN_REGISTER_PANEL:
            return {
                ...state,
                showLoginPanel : false,
                showRegisterPanel : false
            }
        case GET_USER_DETAILS_HEADER:
            //console.log(actions.profileImage);
            return{
                ...state,
                username : actions.payload.username,
                profileImage : actions.payload.profileImage
            }
        case GET_SEARCH_RESULTS:
            return{
                ...state,
                searchResults : actions.payload
            }
        default:
            return state;
    }
}