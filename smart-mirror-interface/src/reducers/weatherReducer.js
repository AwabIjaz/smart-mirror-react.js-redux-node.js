import { FETCH_WEATHER } from '../actions/types';
import { FETCH_FORECAST } from '../actions/types';

const initialState = {
    weatherIconId: '800',
    temperature: 0,
    status: '',
    weatherList:[],
}

export default function (state = initialState, action) {
  switch(action.type) {
      case FETCH_WEATHER:
        return {
            ...state,
            weatherIconId: action.payload1,
            temperature: action.payload2,
            status: action.payload3
        };
      case FETCH_FORECAST:
        return {
            ...state,
            weatherList: action.payload
        };
      default: 
        return state;
  }
}
