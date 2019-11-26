import { POST_VIP_ORDER, BEGIN_LOADING, CLEAR_LOADING } from "../actions/types";

const initialState = {
  record: {},
  loading: false
};
const vipReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case POST_VIP_ORDER:
      return {
        ...state,
        record: payload,
        loading: false
      };
    case BEGIN_LOADING:
      return {
        ...state,
        loading: true
      };
    case CLEAR_LOADING:
      return {
        ...state,
        loading: false
      };

    default:
      return state;
  }
};

export default vipReducer;
