import { FETCH_REMINDERS } from '../actions/types';

const initialState = {
    items:[],
    msg:'',
}

export default function (state = initialState, action) {
  switch(action.type) {
      case FETCH_REMINDERS:
        return {
            ...state,
            items: action.payload
        };
      default: 
        return state;
  }
}
