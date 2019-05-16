import {
  RENDER_CREATE_FORM,
  BEGIN_LOADING,
  CLEAR_LOADING,
  CREATE_WEB_REPORT
} from "../actions/types";

const initialState = {
  settings: {},
  create_result: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RENDER_CREATE_FORM:
      return {
        ...state,
        create_result: {},
        settings: action.payload,
        loading: false
      };
    case CREATE_WEB_REPORT:
      return {
        ...state,
        create_result: action.payload,
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
}
