import { FETCH_VOICE, FETCH_WAKE_WORD, NEW_REMINDER, CHANGE_MESSAGE, FETCH_VIDEO_ID, STOP_VIDEO, FETCH_USER } from './types';
import axios from 'axios';

export const fetchVoice = () => dispatch => {
  axios.get('http://localhost:4000/exp')
      .then(response => {
        console.log(response.data);
        dispatch({
            type: FETCH_VOICE,
            payload1: 'You said: ' + response.data[0],
            payload2: response.data[1],
            payload3: response.data[2],
            payload4: response.data[3],
            payload5: false,
        })
      })
      .catch(function (error) {
        console.log(error);
      })  
};

export const fetchWakeWord = () => dispatch => {
  axios.get('http://localhost:4000/wakeWord')
      .then(response => {
        let yoloo = response.data.trim();
        if(yoloo === "detected"){
          console.log('wakeWord detected')
          dispatch({
            type: FETCH_WAKE_WORD,
            payload1: true,
            payload2: 'Listening...',
            payload3: '',
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      })  
}

export const createReminder = (value,date,username) => dispatch => {
  axios.post('http://localhost:4000/users/db_reminders', 
    { desc:value, date:date, username:username })
      .then((result) => {
        console.log(result.data);
        dispatch({
            type: NEW_REMINDER,
            payload1: result.data,
            payload2: ''
        })
     });
}

export const changeMessage = username => dispatch => {
  dispatch({
      type: CHANGE_MESSAGE,
      payload: 'Hey, '+username,
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