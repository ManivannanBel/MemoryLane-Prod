import { LOAD_MEMORY_LANE } from './types';
import { Dispatch } from 'redux';
import axios from 'axios';

export const loadMemoryLane = () => async (dispatch : Dispatch) => {
    try{
        const result = await axios.get(`api/v0/`);
        console.log(result);
        dispatch({
            type : LOAD_MEMORY_LANE,
            payload : result.data
        })
    }catch(err){
        console.log(err);
    }
}