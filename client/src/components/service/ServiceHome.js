import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import queryString from "query-string";
import isEmpty from "../../validation/is-empty";
import Spinner from "../common/Spinner";
import { setUpQuestionConfig } from "../../actions/questionActions";

import "./service.css";
class ServiceHome extends Component {
  componentDidMount() {
    const search_values = queryString.parse(this.props.location.search);
    //console.log("ServiceHome componentDidMount", this.props.location.search);
    // console.log(
    //   "search_values",
    //   decodeURIComponent(this.props.location.search)
    // );

    this.props.setUpQuestionConfig(
      {
        search_string: decodeURIComponent(this.props.location.search)
      },
      search_values.token
    );
  }

  render() {
    //console.log("game_id", search_game_id);
    //const game_id = this.props.match.params.game_id;
    let game_id = this.props.service.game_id;
    const {
      is_in_game,
      unread_count,
      token,
      loading,
      showInvitation,
      line_invite_link
    } = this.props.service;

    const parsed = queryString.parse(this.props.location.search);
    if (!isEmpty(parsed.param_game_id)) {
      game_id = parsed.param_game_id;
    }
    if (game_id === undefined) {
      game_id = parsed.game_id;
    }
    const linkReport = is_in_game
      ? `/service/${game_id}/create?token=${token}`
      : `/service/${game_id}/create`;
    const linkQuery = is_in_game
      ? `/service/${game_id}/list?token=${token}`
      : `/service/${game_id}/query`;

    // console.log(game_id);
    // console.log(game_id === undefined);

    return (
      <div>
        <nav className="navbar navbar-dark bg-dark">
          <div className="container text-center">
            <span className="navbar-brand mb-0 h1 navbar-text m-auto">
              客服中心
            </span>
          </div>
        </nav>
        {loading ? (
          <Spinner />
        ) : (
          <div className="container" style={{ marginTop: "50px" }}>
            <div className="row">
              <div className="col-md-12 text-center float-right">
                {showInvitation && (
                  <div className="col-md-6 mt-3">
                    <span className="badge badge-info">訊息</span>{" "}
                    <small>
                      邀請您加入 LINE 官帳:
                      <mark>瑞秋電台</mark>
                    </small>
                    <i className="fas fa-arrow-right mr-1 ml-1 text-danger"></i>
                    <a href={`https://line.me/R/ti/p/${line_invite_link}`}>
                      <img
                        src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png"
                        alt="加入好友"
                        height="36"
                        border="0"
                      />
                    </a>
                  </div>
                )}
                <hr />
                <div className="row justify-content-center">
                  <div className="col-sm-6 col-xs-6 col-md-4">
                    <Link to={linkReport} className="quick-button">
                      <i className="fas fa-edit" />
                      <p style={{ padding: "10px" }}>線上回報</p>
                    </Link>
                  </div>
                  <div className="col-sm-6 col-xs-6 col-md-4">
                    <Link to={linkQuery} className="quick-button">
                      <i className="fa fa-file-text" />
                      <p style={{ padding: "10px" }}>回報紀錄</p>
                      {unread_count > 0 && (
                        <span className="notification red">{unread_count}</span>
                      )}
                    </Link>
                  </div>
                </div>
                <div className="row justify-content-center">
                  {is_in_game && (
                    <div className="col-md-12 alert alert-warning m-2">
                      提醒您：若無法選取檔案回報，請直接利用官網線上提問。
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
ServiceHome.defaultProps = {
  is_in_game: false,
  unread_count: 0
};

ServiceHome.propTypes = {
  setUpQuestionConfig: PropTypes.func.isRequired,
  service: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  service: state.service
});

export default connect(
  mapStateToProps,
  { setUpQuestionConfig }
)(ServiceHome);
