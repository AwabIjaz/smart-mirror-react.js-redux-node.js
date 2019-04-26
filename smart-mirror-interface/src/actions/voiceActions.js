import { FETCH_VOICE, FETCH_WAKE_WORD, NEW_REMINDER, NEW_ALARM, CHANGE_MESSAGE, FETCH_VIDEO_ID, STOP_VIDEO, FETCH_USER } from './types';
import axios from 'axios';

let message = '';

export const fetchVoice = () => dispatch => {
  axios.get('http://localhost:4000/commands')
      .then(response => {
        console.log(response.data);
        if(response.data[0] === 'error'){
          console.log('lmao');
          message = 'Could not understand what you said, try again';
        }
        else if(response.data[1] === 'command not found'){
          message = 'Command not found, try again. You said: ' + response.data[0];
        }
        else if(response.data[0] === 'Network error'){
          message = 'Network error, check your internet connection';
        }
        else{
          console.log('in command or in intent'); 
          message = 'You said: ' + response.data[0];
        }
        dispatch({
          type: FETCH_VOICE,
          payload1: message,
          payload2: response.data[1],
          payload3: response.data[2],
          payload4: response.data[3],
          payload5: false,
        })
      })
      .catch(function (error) {
        console.log(error);
      })  
}

export const fetchWakeWord = () => dispatch => {
  dispatch({
    type: FETCH_WAKE_WORD,
    payload1: true,
    payload2: 'Please wait',
    payload3: '',
    payload4: '',
  })   
}

export const createReminder = (value,date,username) => dispatch => {
  axios.post('http://localhost:4000/users/db_reminders', 
    { desc:value, date:date, username:username })
      .then((result) => {
        console.log(result.data);
        dispatch({
            type: NEW_REMINDER,
            payload1: result.data+'. '+message,
            payload2: ''
        })
     });
}

export const setAlarm = (day,time,dayNumber,hours,minutes,username) => dispatch => {
  axios.post('http://localhost:4000/users/db_alarms', 
    { day:day, time:time, dayNumber:dayNumber, hours:hours, minutes:minutes, username:username })
      .then((result) => {
        console.log(result.data);
        dispatch({
            type: NEW_ALARM,
            payload1: result.data+'. '+message,
            payload2: ''
        })
     });
}

export const changeMessage = message => dispatch => {
  dispatch({
      type: CHANGE_MESSAGE,
      payload: message,
  }) 
}

export const fetchVideoId = (value,youtube) => dispatch => {
  youtube.searchVideos(value, 1)
        .then(results => {
          dispatch({
            type: FETCH_VIDEO_ID,
            payload1: results[0].id,
            payload2: ''
          })
          console.log(results[0].id)
        })
        .catch(console.log);
}

export const stopVideo = () => dispatch => {
  dispatch({
      type: STOP_VIDEO,
      payload: 0
  }) 
}

export const fetchUser = username => dispatch => {
  dispatch({
    type: FETCH_USER,
    payload: username
  }) 
}