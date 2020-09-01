import { DROPDOWN_SELECTED_ON_MOMENT_IN_TIMELINE } from '../actions/types';

const initialState = {
    //id of the moment
    previouslySelectedDropdown : '',
    currentlySelectedDropdown : ''
}

export default (state : any = initialState, actions : any) => {
    switch(actions.type){
        case DROPDOWN_SELECTED_ON_MOMENT_IN_TIMELINE:
            return {
                ...state,
                previouslySelectedDropdown : state.currentlySelectedDropdown,
                currentlySelectedDropdown : actions.payload
            }
        default:
            return state;
    }
}