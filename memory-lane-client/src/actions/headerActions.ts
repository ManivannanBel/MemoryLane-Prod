import { SHOW_LOGIN_PANEL, SHOW_REGISTER_PANEL, CLOSE_LOGIN_REGISTER_PANEL, GET_USER_DETAILS_HEADER, GET_SEARCH_RESULTS } from './types';
import { Dispatch } from 'redux';
import axios from 'axios';

export const showLoginPanel = () => (dispatch : Dispatch) => {
    dispatch({
        type : SHOW_LOGIN_PANEL
    });
}

export const showRegisterPanel = () => (dispatch : Dispatch) => {
    dispatch({
        type : SHOW_REGISTER_PANEL
    });
}

export const closeLoginRegisterPanel = () => (dispatch : Dispatch) => {
    dispatch({
        type : CLOSE_LOGIN_REGISTER_PANEL
    });
}

export const getHeaderDetails = (username : string) => async (dispatch : Dispatch) => {
    try{
        const result = await axios.get(`/api/v0/profile/${username}?head=1`);
        dispatch({
            type : GET_USER_DETAILS_HEADER,
            payload : result.data
        })
        //console.log(result.data);
        dispatch({
            type : GET_USER_DETAILS_HEADER,
            payload : result.data
        })
    }catch(err){
        console.log(err);
    }
}

export const searchTheQuery = (query : string) => async (dispatch : Dispatch) => {
    try{
        const result = await axios.get(`/api/v0/search/${query}`);
        console.log(result.data);
        dispatch({
            type : GET_SEARCH_RESULTS,
            payload : result.data
        });
    }catch(err){
        console.log(err);
    }
} 

export const clearSearchResults = () => (dispatch : Dispatch) => {
    dispatch({
        type : GET_SEARCH_RESULTS,
        payload : []
    })
}