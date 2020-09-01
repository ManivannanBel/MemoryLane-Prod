import {combineReducers} from 'redux';
import profileReducer from './profileReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import headerReducer from './headerReducer';
import momentReducer from './momentReducer';
import memoryReducer from './memoryReducer';
import timelineUIReducer from './timelineUIReducer';
import relationshipReducer from './relationshipReducer';
import memoryLaneReducer from './memoryLaneReducer';

const rootReducer = combineReducers({
    auth : authReducer,
    profile : profileReducer,
    error : errorReducer,
    header : headerReducer,
    moments : momentReducer,
    memories : memoryReducer,
    timelineUI : timelineUIReducer,
    relationship : relationshipReducer,
    memoryLane : memoryLaneReducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>