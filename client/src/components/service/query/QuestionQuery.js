import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import TextFieldGroup from "../../common/TextFieldGroup";

import Spinner from "../../common/Spinner";

import { getQuestion } from "../../../actions/questionActions";

class QuestionQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      mobile: "",
      check_id: "",
      errors: "",
      question: {},
      loading: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    document.title = "龍邑遊戲|客服紀錄查詢";
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.service.question) {
      //console.log(nextProps.service.question);
      if (nextProps.service.user) {
        this.props.history.push(
          `/service/${this.props.match.params.game_id}/view/${nextProps.service.user.question_id}?token=${nextProps.service.token}`
        );
      }

      //this.setState({ question: nextProps.service.question });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    //console.log("submit");
    const questionData = {
      email: this.state.email,
      mobile: this.state.mobile,
      check_id: this.state.check_id
    };
    this.props.getQuestion(questionData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value.trim() });
  }
  render() {
    const { errors } = this.state;
    const { loading } = this.props.service;
    const home_link = `/service_quick?param_game_id=${this.props.match.params.game_id}`;
    return (
      <div className="query">
        {!errors && loading ? (
          <Spinner />
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-md-9 col-lg-6 m-auto">
                <h4 className="text-center">線上回報紀錄查詢</h4>
                <p className="lead text-center">請填寫以下資訊</p>
                <small className="d-block pb-3">
                  * = Email 或手機擇一填寫即可
                </small>
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="* Email"
                    name="email"
                    type="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                    info="填寫回報時所用Email"
                  />
                  <TextFieldGroup
                    placeholder="* 手機"
                    name="mobile"
                    type="tel"
                    value={this.state.mobile}
                    onChange={this.onChange}
                    error={errors.mobile}
                    info="填寫回報時所用的手機號碼"
                  />
                  <TextFieldGroup
                    placeholder="客服代碼"
                    name="check_id"
                    type="text"
                    value={this.state.check_id}
                    onChange={this.onChange}
                    error={errors.check_id}
                    info="回報完成後得到的代碼, 可以在email中查詢"
                  />
                  <input
                    type="submit"
                    value="送出"
                    className="btn btn-info btn-block"
                  />

                  <Link className="btn btn-secondary btn-block" to={home_link}>
                    回到客服中心
                  </Link>
                </form>
                {errors.noexist && (
                  <div className="alert alert-danger mt-4" role="alert">
                    查找的問題不存在, 請確認您輸入的欄位是否正確
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

QuestionQuery.propTypes = {
  getQuestion: PropTypes.func.isRequired,

  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  errors: state.errors,
  service: state.service
});

export default connect(
  mapStateToProps,

  { getQuestion }
)(withRouter(QuestionQuery));
