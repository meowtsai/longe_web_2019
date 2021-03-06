import {
  GET_ERRORS,
  CLEAR_ERRORS,
  POSTING_LOADING,
  CLEAR_LOADING,
  GET_QUESTION_BY_CHECKID,
  GET_QUESTION_BY_ID,
  QUESTION_INIT_SETUP,
  FOCUS_REPLY,
  GET_REPLIES,
  CLOSE_QUESTION,
  GET_QUESTION_LIST,
} from './types';

import axios from 'axios';

import isEmpty from '../validation/is-empty';
export const postLoading = () => {
  return {
    type: POSTING_LOADING,
  };
};
export const clearLoading = () => {
  return {
    type: CLEAR_LOADING,
  };
};

export const createQuestion = (questionData, history) => (dispatch) => {
  dispatch(postLoading());
  axios
    .post('/api/question', questionData)
    .then((res) => {
      //console.log("createQuestion", res.data.msg.token);
      //localStorage.setItem("jwtToken", res.data.msg.token);
      dispatch({
        type: GET_QUESTION_BY_CHECKID,
        payload: res.data.msg,
      });
    })
    .catch((err) => {
      dispatch(clearLoading());
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getQuestion = (questionData) => (dispatch) => {
  dispatch(postLoading());
  dispatch(clearErrors());

  axios
    .post('/api/questions/by_checkid', questionData)
    .then((res) => {
      //localStorage.setItem("jwtToken", res.data.msg.token);
      dispatch({
        type: GET_QUESTION_BY_CHECKID,
        payload: res.data.msg,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getQuestionById = (q_id, token, history) => (dispatch) => {
  dispatch(postLoading());
  dispatch(clearErrors());

  // const token =
  //   localStorage.getItem("inGameToken") !== "undefined"
  //     ? localStorage.getItem("inGameToken")
  //     : localStorage.getItem("jwtToken");
  //console.log("getQuestionById", token);
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  //console.log("getQuestionById", config);
  axios
    .get(`/api/questions/view/${q_id}`, config)
    .then((res) =>
      dispatch({
        type: GET_QUESTION_BY_ID,
        payload: res.data.msg,
      })
    )
    .catch((err) => {
      //console.log("err. ", err.response.data);
      dispatch(clearLoading());
      if (err.response.data.jwt) {
        //localStorage.removeItem("jwtToken");
        history.push('../query');
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

export const getQuestionList = (token) => (dispatch) => {
  dispatch(postLoading());

  //console.log("getQuestionById", token);
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  //console.log("getQuestionList", config);
  axios
    .get(`/api/questions/list/`, config)
    .then((res) =>
      dispatch({
        type: GET_QUESTION_LIST,
        payload: res.data.msg,
      })
    )
    .catch((err) => {
      //console.log("err. ", err.response.data);
      if (err.response.data.jwt) {
        //history.push("../query");
      }
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const insert_reply = (reply, token, history) => (dispatch) => {
  //const token = localStorage.getItem("jwtToken");
  const config = {
    headers: { 'Content-Type': 'multipart/form-data' },
  };
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  dispatch(postLoading());
  dispatch(clearErrors());
  axios
    .post(`/api/questions/insert_reply`, reply, config)
    .then((res) =>
      dispatch({
        type: GET_REPLIES,
        payload: res.data.msg,
      })
    )
    .catch((err) => {
      // console.log("err. ", err);
      // console.log("err.message ", err.message);
      // console.log("err.status ", err.status);
      dispatch(clearLoading());
      if (!err.response.status) {
        // network error
        dispatch({
          type: GET_ERRORS,
          payload: { file01: '附件尺寸太大, 請控制在8MB以內' },
        });
      } else if (err.response.data.jwt) {
        //localStorage.removeItem("jwtToken");
        history.push('../query');
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

export const setUpQuestionConfig = (validationObject, token) => (dispatch) => {
  //let token;
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };

  //const parsed = queryString.parse(validationObject.search_string);
  //console.log(parsed);
  // if (!isEmpty(parsed.param_game_id)) {
  //   localStorage.removeItem("inGameToken");
  // } else {
  //   token = localStorage.getItem("inGameToken");
  // }

  //?param_game_id=g78naxx2hmt

  if (!isEmpty(token)) {
    //console.log("setUpQuestionConfig", token);
    config.headers['x-auth-token'] = token;
  }
  dispatch(postLoading());
  axios
    .post('/api/service/init_setup', validationObject, config)
    .then((res) => {
      //console.log('setUpQuestionConfig return ', res.data);
      //localStorage.setItem("inGameToken", res.data.token);
      dispatch({
        type: QUESTION_INIT_SETUP,
        payload: res.data,
      });
    })
    .catch((err) => {
      //console.log('setUpQuestionConfig err ', err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const closeQuestion = (q_id, token, history) => (dispatch) => {
  // console.log("q_id", q_id);
  // console.log("token", token);
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  axios
    .post(`/api/questions/close_question`, { question_id: q_id }, config)
    .then((res) =>
      dispatch({
        type: CLOSE_QUESTION,
        payload: res.data.msg,
      })
    )
    .catch((err) => {
      //console.log("err. ", err.response.data);

      if (err.response.data.jwt) {
        //localStorage.removeItem("jwtToken");
        history.push('../query');
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};

export const stillInDoubt = () => {
  return {
    type: FOCUS_REPLY,
  };
};
