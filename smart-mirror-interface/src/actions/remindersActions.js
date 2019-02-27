import { FETCH_REMINDERS } from './types';
import axios from 'axios';

export const fetchReminders = Username => dispatch => {
  axios.post('http://localhost:4000/users/get_reminders', {username:Username})
      .then(response => {
          
        if(response.data !== 'no reminders'){
          dispatch({
            type: FETCH_REMINDERS,
            payload: response.data
          })
        }

        else{
          dispatch({
            type: FETCH_REMINDERS,
            payload: []
          })
        }
          
      }) 
};