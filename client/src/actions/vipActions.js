import {
  BEGIN_LOADING,
  CLEAR_LOADING,
  POST_VIP_ORDER,
  GET_ERRORS
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

export const createVipOrder = orderData => dispatch => {
  dispatch(beginLoading());
  axios
    .post("/api/vip/createOrder", orderData, {
      headers: { "Content-Type": "application/json" }
    })
    .then(res => {
      dispatch({
        type: POST_VIP_ORDER,
        payload: res.data.record
        //res.json({ msg: "OK", record: wireReportObject });
      });
    })
    .catch(err => {
      dispatch(clearLoading());

      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
