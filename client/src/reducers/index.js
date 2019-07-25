import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import gameReducer from "./gameReducer";
import serviceReducer from "./serviceReducer";
import reportReducer from "./reportReducer";
import eventReducer from "./eventReducer";

export default combineReducers({
  errors: errorReducer,
  games: gameReducer,
  service: serviceReducer,
  report: reportReducer,
  event: eventReducer
});
