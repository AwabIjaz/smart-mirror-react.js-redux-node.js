import { FETCH_WEATHER, FETCH_FORECAST } from './types';
import axios from 'axios';

export const fetchWeather = () => dispatch => {
  axios.get('http://localhost:4000/weather')
      .then(response => {
        dispatch({
            type: FETCH_WEATHER,
            payload1:  "" + response.data.weather[0].id,
            payload2: Math.ceil(-273 + response.data.main.temp),
            payload3: response.data.weather[0].main
        })
      })
      .catch(function (error) {
        console.log(error);
      })

  axios.get('http://localhost:4000/forecast')
    .then(response => {
      dispatch({
          type: FETCH_FORECAST,
          payload: response.data.list,
      })
    })
    .catch(function (error) {
      console.log(error);
      })  
};