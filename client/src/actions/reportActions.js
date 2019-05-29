import {
  BEGIN_LOADING,
  CLEAR_LOADING,
  RENDER_CREATE_FORM,
  GET_ERRORS,
  CREATE_WEB_REPORT
} from "./types";

import axios from "axios";

export const beginLoading = () => {
  return {
    type: BEGIN_LOADING
  };
};
export const clearLoading = () => {
  return {
    type: CLEAR_LOADING
  };
};
export const renderForm = game_id => dispatch => {
  dispatch(beginLoading());
  const token = localStorage.getItem("inGameToken");
  const config = {
    headers: { "Content-Type": "application/json" }
  };
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  axios
    .get(`/api/questions/render_create_form/${game_id}`, config)
    .then(res =>
      dispatch({
        type: RENDER_CREATE_FORM,
        payload: res.data
      })
    )
    .catch(err => {
      //console.log(err);
      dispatch(clearLoading());
      if (err.response.data.jwt) {
        localStorage.removeItem("inGameToken");
      }
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const createWebReport = (questionData, history) => dispatch => {
  dispatch(beginLoading());
  axios
    .post("/api/questions/create_web_form", questionData, {
      headers: { "Content-type": "multipart/form-data" }
    })
    .then(res => {
      //console.log("createWebReport status", res.status);
      localStorage.setItem("jwtToken", res.data.msg.token);
      dispatch({
        type: CREATE_WEB_REPORT,
        payload: res.data.msg
      });
    })
    .catch(err => {
      //console.log("err", err.response);
      dispatch(clearLoading());
      if (!err.response.status) {
        // network error
        dispatch({
          type: GET_ERRORS,
          payload: { file01: "附件尺寸太大, 請控制在8MB以內" }
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      }
    });
};
