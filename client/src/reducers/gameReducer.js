import { GET_GAMES, GET_GAME, GET_SERVERS } from "../actions/types";

const initialState = {
  games: [],
  game: {},
  loading: false
};
const gameReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_GAMES:
      return {
        ...state,
        games: payload,
        loading: false
      };
    case GET_GAME:
      return {
        ...state,
        game: payload,
        loading: false
      };
    case GET_SERVERS:
      return {
        ...state,
        game: { ...state.game, servers: payload },
        loading: false
      };

    default:
      return state;
  }
};

export default gameReducer;
