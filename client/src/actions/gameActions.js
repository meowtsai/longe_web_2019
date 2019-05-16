import { GET_GAMES, GET_GAME, GET_SERVERS } from "./types";

export const getGames = () => dispatch => {
  return fetch("/api/games/get_games")
    .then(res => res.json())
    .then(games_res => dispatch({ type: GET_GAMES, payload: games_res.msg }));
};

export const getGame = game_id => dispatch => {
  return fetch(`/api/games/get_game/${game_id}`)
    .then(res => res.json())
    .then(game_res => dispatch({ type: GET_GAME, payload: game_res.msg }));
};

export const getServers = game_id => dispatch => {
  return fetch(`/api/games/get_servers/${game_id}`)
    .then(res => res.json())
    .then(sr_res => dispatch({ type: GET_SERVERS, payload: sr_res.msg }));
};
