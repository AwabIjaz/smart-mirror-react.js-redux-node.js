import { combineReducers } from 'redux';
import newsReducer from './newsReducer';
import weatherReducer from './weatherReducer';
import remindersReducer from './remindersReducer';
import voiceReducer from './voiceReducer';

export default combineReducers({
    news: newsReducer,
    weather: weatherReducer,
    reminders: remindersReducer,
    voice: voiceReducer
});