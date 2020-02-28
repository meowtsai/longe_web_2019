import {
  EVENT_LOAD_USER,
  BEGIN_LOADING,
  CLEAR_LOADING,
  REDEEM_SERIAL,
  DELIVEROO_VERIFY,
  DELIVEROO_RESET
} from '../actions/types';

const initialState = {
  loading: true,
  user: {},
  event: {},
  logs: [],
  redeem_msg: '',
  redeem_status: 'NORMAL'
};

export default function(state = initialState, action) {
  switch (action.type) {
    case EVENT_LOAD_USER:
      return {
        ...action.payload,
        redeem_msg: '',
        loading: false
      };
    case BEGIN_LOADING:
      return {
        ...state,
        redeem_msg: '',
        loading: true
      };
    case CLEAR_LOADING:
      return {
        ...state,
        loading: false
      };
    case REDEEM_SERIAL:
      return {
        ...state,
        redeem_msg: action.payload.msg,
        logs: action.payload.logs,
        loading: false
      };
    case DELIVEROO_VERIFY:
      return {
        ...state,
        redeem_msg: action.payload.msg,
        logs: action.payload.logs,
        loading: false
      };
    case DELIVEROO_RESET:
      return {
        ...initialState,
        loading: false
      };

    default:
      return state;
  }
}
