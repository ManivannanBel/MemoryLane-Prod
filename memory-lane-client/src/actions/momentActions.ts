import { CREATE_MOMENT, GET_USER_MOMENTS, CLEAR_USER_MOMENTS, DELETE_USER_MOMENTS, UPDATE_USER_MOMENTS, GET_USER_SEARCH_RESULT } from './types';
import { Dispatch } from 'redux';
import axios from 'axios';
import { ICreateMoment } from '../types/requestPayloads/moment';
import { IMomentResponse } from '../types/responseTypes/moment';

export const createMoment = (moment : ICreateMoment) => async (dispatch : Dispatch) => {
    try{
        const imgFiles = moment.images
        console.log(imgFiles);
        delete moment.images;
        //const momentResponse = await axios.post('/api/v0/M/', moment);
        //console.log(momentResponse);
        
        const formData = new FormData();

        for (let key in moment){
            formData.append(key, (moment as any)[key]);
        }

        for(let file of imgFiles){
            //console.log(file);
            formData.append('file', file);
        }
        //console.log(formData);
        //console.log(`/api/v0/M/upload/${momentResponse.data._id}`);
        const momentResponse : any = await axios.post(`/api/v0/M/`, formData, {
            headers : {
                'Content-Type' : 'multipart/form-data'
            }
        }); 
        console.log(momentResponse);

        const momentData : IMomentResponse = {
            id : momentResponse.data.id,
            title : momentResponse.data.title,
            description : momentResponse.data.description,
            date : momentResponse.data.date,
            files : momentResponse.data.files,
            owner : momentResponse.data.owner,
            group : momentResponse.data.group
        }

        console.log('momData');
        console.log(momentData);
        dispatch({
            type : CREATE_MOMENT,
            payload : momentData
        });
    }catch(e){
        console.log(e);
    }
}

export const getUserMoments = (username : string) => async (dispatch : Dispatch) => {
    try{
        const result = await axios.get(`/api/v0/M/${username}`);
        // console.log(typeof(result.data.moments));
         console.log(result.data.moments);
        dispatch({
            type : GET_USER_MOMENTS,
            payload : result.data.moments
        })
    }catch(err){
        console.log(err);        
    }
}

export const deleteMoment = (momentId : string) => async (dispatch : Dispatch) => {
    try{
        const result = await axios.delete(`/api/v0/M/${momentId}`);
        console.log(result);
        dispatch({
            type : DELETE_USER_MOMENTS,
            payload : {momentId}
        })
    }catch(err){
        console.log(err);
    }
}

export const updateMoment = (momentId : string, dataToBeUpdated : any) => async (dispatch : Dispatch) => {
    try{

        const newImages = dataToBeUpdated.newImages;
        //if(dataToBeUpdated.newImages.length > 0){
        //newImages.concat(dataToBeUpdated.newImages);
        //}
        console.log(newImages);
        delete dataToBeUpdated.newImages;

        const formData = new FormData();

        for (let key in dataToBeUpdated){
            console.log((dataToBeUpdated as any)[key]);
            formData.append(key, (dataToBeUpdated as any)[key]);
        }

        for(let file of newImages){
            //console.log(file);
            formData.append('file', file);
        }

        const updatedMomentResponse = await axios.put(`/api/v0/M/${momentId}`, formData, {
            headers : {
                'Content-Type' : 'multipart/form-data'
            }
        });

        console.log(updatedMomentResponse);

        const momentData : IMomentResponse = {
            id : updatedMomentResponse.data.id,
            title : updatedMomentResponse.data.title,
            description : updatedMomentResponse.data.description,
            date : updatedMomentResponse.data.date,
            files : updatedMomentResponse.data.files,
            owner : updatedMomentResponse.data.owner,
            group : updatedMomentResponse.data.group
        }
        dispatch({
            type : UPDATE_USER_MOMENTS,
            payload : momentData
        })
    }catch(err){
        console.log(err);
    }
}

export const clearUserMoments = () => async (dispacth : Dispatch) => {
    dispacth({
        type : CLEAR_USER_MOMENTS
    })
}

export const searchUserQuery = (query : string) => async (dispatch : Dispatch) => {
    try{
        const result = await axios.get(`/api/v0/usearch/${query}`);
        console.log(result.data);
        dispatch({
            type : GET_USER_SEARCH_RESULT,
            payload : result.data
        });
    }catch(err){
        console.log(err);
    }
} 