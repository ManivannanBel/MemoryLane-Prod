import { GET_RELATIONSHIP_STATUS } from './types';
import { Dispatch } from 'redux';
import axios from 'axios';

export const getRelationshipStatus = (username : string) => async (dispatch : Dispatch) => {
    try{
        const relationshipStatus = await axios.get(`/api/v0/R/${username}`);
        dispatch({
            type : GET_RELATIONSHIP_STATUS,
            payload : relationshipStatus.data
        })
    }catch(err){
        console.log(err);
    }
}

export const sendFriendRequest = (username : string) => async (dispatch : Dispatch) => {
    try{
        const relationshipStatus = await axios.post(`/api/v0/R/fr`,{user2username : username});
        dispatch({
            type : GET_RELATIONSHIP_STATUS,
            payload : relationshipStatus.data
        })
    }catch(err){
        console.log(err);
    }
}

export const acceptFriendRequest = (username : string) => async (dispatch : Dispatch) => {
    try{
        const relationshipStatus = await axios.put(`api/v0/R/acceptRequest`, {user2username : username});
        dispatch({
            type : GET_RELATIONSHIP_STATUS,
            payload : relationshipStatus.data
        })
    }catch(err){
        console.log(err);
    }
}

export const block = (username : string) => async (dispatch : Dispatch) => {
    try{
        const relationshipStatus = await axios.put(`api/v0/R/block`, {user2username : username});
        dispatch({
            type : GET_RELATIONSHIP_STATUS,
            payload : relationshipStatus.data
        })
    }catch(e){
        console.log(e);
    }
}

export const unfriend = (username : string) => async (dispatch : Dispatch) => {
    try{
        const relationshipStatus = await axios.put(`api/v0/R/unfriend`, {user2username : username});
        dispatch({
            type : GET_RELATIONSHIP_STATUS,
            payload : relationshipStatus.data
        })
    }catch(e){
        console.log(e);
    }
}

export const unblock = (username : string) => async (dispatch : Dispatch) => {
    try{
        const relationshipStatus = await axios.put(`api/v0/R/unblock`, {user2username : username});
        dispatch({
            type : GET_RELATIONSHIP_STATUS,
            payload : relationshipStatus.data
        })
    }catch(e){
        console.log(e);
    }
}

export const cancelRequest = (username : string) => async (dispatch : Dispatch) => {
    try{
        const relationshipStatus = await axios.put(`api/v0/R/cancelRequest`, {user2username : username});
        dispatch({
            type : GET_RELATIONSHIP_STATUS,
            payload : relationshipStatus.data
        })
    }catch(e){
        console.log(e);
    }
}

export const rejectRequest = (username : string) => async (dispatch : Dispatch) => {
    try{
        const relationshipStatus = await axios.put(`api/v0/R/rejectRequest`, {user2username : username});
        console.log(relationshipStatus);
        dispatch({
            type : GET_RELATIONSHIP_STATUS,
            payload : relationshipStatus.data
        })
    }catch(e){
        console.log(e);
    }
}