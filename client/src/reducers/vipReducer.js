import {
  POST_VIP_ORDER,
  BEGIN_LOADING,
  CLEAR_LOADING,
  CHECK_WIRE_REPORT_TOKEN,
  GET_VIP_PRODUCTS,
} from '../actions/types';

const initialState = {
  record: {},
  products: [],
  previous_record: {},
  loading: false,
};
const vipReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case POST_VIP_ORDER:
      return {
        ...state,
        record: payload,
        loading: false,
      };
    case CHECK_WIRE_REPORT_TOKEN:
      return {
        ...state,
        previous_record: payload,
        loading: false,
      };
    case GET_VIP_PRODUCTS:
      return {
        ...state,
        products: payload,
        loading: false,
      };
    case BEGIN_LOADING:
      return {
        ...state,
        loading: true,
      };
    case CLEAR_LOADING:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export default vipReducer;
