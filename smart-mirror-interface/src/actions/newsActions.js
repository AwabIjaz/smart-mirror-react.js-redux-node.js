import { FETCH_NEWS } from './types';
import axios from 'axios';

export const fetchNews = () => dispatch => {
  axios.get('http://localhost:4000/news')
      .then(response => {
        dispatch({
            type: FETCH_NEWS,
            payload: response.data
        })
      })
      .catch(function (error) {
        console.log(error);
      })  
};