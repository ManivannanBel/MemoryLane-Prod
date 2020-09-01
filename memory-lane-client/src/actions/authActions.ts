import { FETCH_USER, SET_CURRENT_USER, GET_ERROR, CLOSE_LOGIN_REGISTER_PANEL, SHOW_LOGIN_PANEL } from './types';
import { Dispatch, AnyAction }  from 'redux';
import { ThunkAction } from 'redux-thunk';
import axios from 'axios';
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";


export const fetchUserData = () => async (dispatch : Dispatch) => {
    try{
        
        const res = await axios.get('/api/v0/auth/current_user');
        // console.log("userdata");
        // console.log(res);
        
        dispatch({
            type : FETCH_USER,
            payload : res.data
        });
    }catch(err){
        console.log(err);
    }
}

export const loginUser = (loginCreds : any, history : any) => async (dispatch : Dispatch) => {
    try{    
        const res = await axios.post("/api/v0/auth/signin", loginCreds);
        //console.log(res);
        
        const token = res.data.token;
        //save to local storage
        localStorage.setItem('jwtToken', token);
        //set token to auth header
        setAuthToken(token);
        //Decode token
        const decoded = jwt_decode(token);
        //console.log(decoded);
        
        //set current user
        dispatch(setCurrentUser(decoded));
        dispatch({
            type : CLOSE_LOGIN_REGISTER_PANEL
        })
        history.push('/');
    }catch(err){
        // dispatch({
        //     type : GET_ERRORS,
        //     payload : err.response.data
        // })
    }
}

export const registerUser = (userData : any, history : any) => async (dispatch : Dispatch) => {
    try{
        const res = await axios.post(`/api/v0/auth/register`, userData);
        //console.log(res);
        dispatch({
            type : SHOW_LOGIN_PANEL
        });
    }catch(err){
        console.log(err);
        
        dispatch({
            type : GET_ERROR,
            payload : 'error in register user'
        })
    }
}

export const setQueryToLocal = (token : any, history : any) => async (dispatch : Dispatch) => {
    //save to local storage
    localStorage.setItem('jwtToken', token);
    //set token to auth header
    setAuthToken(token);
    //Decode token
    const decoded = jwt_decode(token);
    //console.log(decoded);
    
    //set current user
    dispatch(setCurrentUser(decoded));
    history.push('/');
}

//Set logged in user 
export const setCurrentUser = (decoded : any) => {
    return({
        type : FETCH_USER,
        payload : decoded
    })
}

//Logout
export const logout = ()  => {
    //Remove token
    localStorage.removeItem("jwtToken");
    //Remove auth header
    setAuthToken(false);
    window.location.href = "/";
    //Set current user to {} to set isAuthenticated to false
    return (setCurrentUser({isAuth : false, username : ''}))
}
