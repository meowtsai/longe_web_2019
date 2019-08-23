import {
  POSTING_LOADING,
  CLEAR_LOADING,
  POST_QUESTION,
  GET_QUESTION_BY_CHECKID,
  GET_QUESTION_BY_ID,
  QUESTION_INIT_SETUP,
  GET_USER_BY_TOKEN,
  GET_REPLIES,
  CLOSE_QUESTION,
  GET_QUESTION_LIST
} from "../actions/types";

const initialState = {
  question: {},
  question_list: [],
  token: null,
  user: null,
  loading: false,
  is_in_game: false,
  unread_count: 0,
  game_id: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case POST_QUESTION:
      return {
        ...state,
        question: action.payload,
        loading: false
      };
    case GET_QUESTION_BY_CHECKID:
      let { check_id, email, mobile, question_id, token } = action.payload;
      return {
        ...state,
        token,
        user: { check_id, email, mobile, question_id },
        loading: false
      };
    case QUESTION_INIT_SETUP:
      return {
        ...state,
        token: action.payload.token,
        is_in_game: action.payload.is_in_game,
        unread_count: action.payload.unread_count,
        game_id: action.payload.game_id,
        isWhitelisted: action.payload.isWhitelisted,
        loading: false
      };

    case GET_QUESTION_BY_ID:
      return {
        ...state,
        question: action.payload,
        loading: false
      };
    case GET_QUESTION_LIST:
      return {
        ...state,
        question_list: action.payload,
        loading: false
      };

    case GET_REPLIES:
      return {
        ...state,
        question: {
          ...state.question,
          replies: action.payload.replies,
          pic_plus: action.payload.pic_plus
        },
        loading: false
      };
    case CLOSE_QUESTION:
      return {
        ...state,
        question: { ...state.question, status: "4" },
        loading: false
      };

    case GET_USER_BY_TOKEN:
      return {
        ...state,
        user: action.payload,
        loading: false
      };

    case POSTING_LOADING:
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
