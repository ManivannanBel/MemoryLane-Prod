import { GET_PROFILE_DATA, GET_PROFILE_IMAGE, GET_USER_DETAILS_HEADER } from './types';
import { Dispatch } from 'redux';
import axios from 'axios';

export const getProfileData = (username : string) => async (dispatch : Dispatch) => {
    try{
        const response = await axios.get(`/api/v0/profile/${username}`);
        //console.log(response);
        
        dispatch({
            type : GET_PROFILE_DATA,
            payload : response.data
        })
    }catch(err){
        console.log(err);
        
        // if(err.response.status === 401){
        //     console.log('err 401');
        // }else if(err.response.status === 404){
        //     console.log('err 404');
        // }else{
        //     console.log('err');
        // }
    }
}

export const getProfileImage = (username : string) => async (dispatch : Dispatch) => {
    try{
        const res = await axios.get(`/api/v0/profile/profileImg/${username}`);
        dispatch({
            type : GET_PROFILE_IMAGE,
            payload : res.data
        })
    }catch(err){

    }
}

export const updateProfileImage = (username : string, file : File) => async (dispatch : Dispatch) => {
    try{
        const formData = new FormData();
        
        formData.append('username', username);
        formData.append('file', file);
        
        const res = await axios.put(`/api/v0/profile/profileImg`, formData, {
            headers : {
                'Content-Type' : 'multipart/form-data'
            } 
        });
        dispatch({
            type : GET_USER_DETAILS_HEADER,
            payload : {username : username, profileImage : res.data.profileImage}
        })
        dispatch({
            type : GET_PROFILE_IMAGE,
            payload : res.data
        });
        console.log(res);
    }catch(err){
        console.log(err);
    }
}