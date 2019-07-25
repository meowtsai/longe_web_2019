import axios from "axios";
import {
  EVENT_LOAD_USER,
  REDEEM_SERIAL,
  GET_ERRORS,
  CLEAR_ERRORS,
  BEGIN_LOADING,
  CLEAR_LOADING
} from "./types";

const config = {
  headers: { "Content-Type": "application/json" }
};

export const loadUser = (event_id, token) => dispatch => {
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  dispatch(postLoading());
  dispatch(clearErrors());

  axios
    .get(`/api/events/render_event_form/${event_id}`, config)
    .then(res =>
      dispatch({
        type: EVENT_LOAD_USER,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(clearLoading());
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const redeemSerial = (event_id, token, serial_no) => dispatch => {
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  dispatch(postLoading());
  dispatch(clearErrors());
  axios
    .post(`/api/events/redeem_serial_code/${event_id}`, { serial_no }, config)
    .then(res =>
      dispatch({
        type: REDEEM_SERIAL,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(clearLoading());
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const postLoading = () => {
  return {
    type: BEGIN_LOADING
  };
};
export const clearLoading = () => {
  return {
    type: CLEAR_LOADING
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
