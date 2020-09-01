import { DROPDOWN_SELECTED_ON_MOMENT_IN_TIMELINE } from './types';
import { Dispatch } from 'redux';

export const selectMenuInTimeLine = (momentId : string) => (dispatch : Dispatch) => {
    dispatch({
        type : DROPDOWN_SELECTED_ON_MOMENT_IN_TIMELINE,
        payload : momentId
    });
}