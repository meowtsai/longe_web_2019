import { POST_VIP_ORDER } from "../actions/types";

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

    default:
      return state;
  }
};

export default vipReducer;
