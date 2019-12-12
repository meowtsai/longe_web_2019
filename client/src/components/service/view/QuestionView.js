import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import ReCAPTCHA from "react-google-recaptcha";
import Spinner from "../../common/Spinner";
import FileGroup from "../../common/FileGroup";
import TextAreaFieldGroup from "../../common/TextAreaFieldGroup";
import ReplyContent from "./ReplyContent";
import isEmpty from "../../../validation/is-empty";
import queryString from "query-string";
import {
  getQuestionById,
  insert_reply
} from "../../../actions/questionActions";
// question: {},
// token: null,
// user: null,
// loading: false

class QuestionView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      errors: "",
      captcha_token: "",
      loading: false,
      file01: "",
      attachments: [],
      token: "",
      useRecaptcha: true
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
  }
  componentDidMount() {
    const search_values = queryString.parse(this.props.location.search);
    document.title = "龍邑遊戲|提問單檢視";
    const q_id = this.props.match.params.q_id;

    this.setState({ token: search_values.token });
    this.props.getQuestionById(q_id, search_values.token, this.props.history);
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.service) {
    //   const { question } = nextProps.service;

    //   //console.log("user", user);
    //   if (
    //     question &&
    //     question.partner_uid !== null &&
    //     this.props.match.params.game_id === "h38na"
    //   ) {
    //     this.setState({ useRecaptcha: false });
    //   }
    // }

    if (nextProps.errors) {
      //console.log(nextProps.errors);

      if (nextProps.errors.jwt) {
        this.props.history.push(
          `/service/${this.props.match.params.game_id}/query`
        );
      }
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const q_id = this.props.match.params.q_id;
    let formData = new FormData();
    let fileArray = this.state.attachments;
    for (let index = 1; index <= fileArray.length; index++) {
      formData.append(`attachment${index}`, fileArray[index - 1]);
    }
    formData.append("content", this.state.content);
    formData.append("question_id", q_id);
    formData.append("captcha_token", this.state.captcha_token);
    formData.append("useRecaptcha", this.state.useRecaptcha);

    this.props.insert_reply(formData, this.state.token, this.props.history);
    this.setState({ content: "", attachments: [], file01: "" });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    //console.log(e.target.files);
    if (!isEmpty(e.target.files)) {
      if (Object.keys(e.target.files).length > 3) {
        this.setState({
          file01: "",
          errors: { file01: "請勿選取超過3個檔案" },
          attachments: []
        });
      } else {
        this.setState({ errors: {}, attachments: e.target.files });
      }
    }
  }

  verifyCallback(recaptchaToken) {
    this.setState({ captcha_token: recaptchaToken });
  }
  render() {
    const { question, loading } = this.props.service;
    const { errors, attachments, token, useRecaptcha } = this.state;
    const fileInfo = Object.keys(attachments).map(
      attach => attachments[attach].name
    );

    const home_link = !isEmpty(question.partner_uid)
      ? `/service_quick?token=${token}`
      : `/service_quick?param_game_id=${this.props.match.params.game_id}`;
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-9 col-lg-6 m-auto">
            <h4 className="text-center mt-5">提問查詢</h4>
            {loading ? (
              <Spinner />
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th nowrap="true" scope="col">
                      案件編號
                    </th>
                    <td>
                      <span className="number">[ #{question.id} ]</span>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">提問類型</th>
                    <td>
                      <span className="badge badge-danger">
                        {question.type_text}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">遊戲名稱</th>
                    <td>{question.game_name}</td>
                  </tr>
                  <tr>
                    <th scope="row">伺服器</th>
                    <td>{question.server_name}</td>
                  </tr>
                  <tr>
                    <th scope="row">角色名稱</th>
                    <td>{question.character_name}</td>
                  </tr>
                  <tr>
                    <th scope="row">E-MAIL</th>
                    <td>{question.email}</td>
                  </tr>
                  <tr>
                    <th scope="row">手機號碼</th>
                    <td>{question.phone}</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h5 className="mb-3">
                        <i className="fas fa-user-edit mr-2 text-info" />{" "}
                        提問描述
                      </h5>
                      <div className="card mb-3 border-dark">
                        <div className="card-body  text-dark">
                          <p
                            className="card-text"
                            dangerouslySetInnerHTML={{
                              __html: question.content
                            }}
                          />
                          {!isEmpty(question.pic_path1) && (
                            <div className="btn-group">
                              <a
                                href={question.pic_path1}
                                className="btn btn-sm btn-outline-secondary"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                附圖1
                              </a>

                              {!isEmpty(question.pic_path2) && (
                                <a
                                  href={question.pic_path2}
                                  className="btn btn-sm btn-outline-secondary"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  附圖2
                                </a>
                              )}
                              {!isEmpty(question.pic_path3) && (
                                <a
                                  href={question.pic_path3}
                                  className="btn btn-sm btn-outline-secondary"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  附圖3
                                </a>
                              )}

                              {!isEmpty(question.pic_plus) &&
                                question.pic_plus
                                  .filter(pic => pic.reply_id === 0)
                                  .map((pic, idx) => (
                                    <a
                                      key={pic.id}
                                      href={pic.pic_path}
                                      className="btn btn-sm btn-outline-secondary"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      附圖{idx + 4}
                                    </a>
                                  ))}
                            </div>
                          )}
                        </div>

                        <div className="card-footer text-muted small">
                          <Moment format="YYYY/MM/DD HH:mm">
                            {question.create_time}
                          </Moment>
                        </div>
                      </div>
                      {!question.replies || question.replies.length === 0 ? (
                        <div>
                          <h5 className="mb-3">
                            <i className="fas fa-user-clock mr-2 text-success" />{" "}
                            專員回覆
                          </h5>
                          <div className="card mb-3 border-dark">
                            <div className="card-body  text-dark">
                              <div
                                className="alert alert-warning fade show"
                                role="alert"
                              >
                                <strong>提問已經送出!</strong>{" "}
                                請耐心等候，我們查明之後將盡快回覆您。
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <ReplyContent
                          q_status={question.status}
                          token={token}
                          replies={question.replies}
                          pic_plus={question.pic_plus.filter(
                            pic => pic.reply_id !== 0
                          )}
                        />
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2">
                      {question.status !== "4" && (
                        <div>
                          <h5 className="mb-2">
                            <i className="fas fa-question mr-2 text-danger" />
                            再次提問
                          </h5>
                          <div className="card border-dark">
                            <div className="card-body">
                              <form onSubmit={this.onSubmit}>
                                <TextAreaFieldGroup
                                  placeholder="* 請填寫針對本問題還有要補充說明的地方..."
                                  name="content"
                                  value={this.state.content}
                                  onChange={this.onChange}
                                  error={errors.content}
                                  info="* 若與本次提問主題不同，請以另開單方式提問"
                                />

                                <div className="form-group">
                                  <label
                                    htmlFor="file1"
                                    className="text-primary"
                                  >
                                    附件
                                  </label>

                                  <FileGroup
                                    name="file01"
                                    filename={
                                      !isEmpty(fileInfo)
                                        ? `已選取${
                                            Object.keys(attachments).length
                                          }個`
                                        : "附件(最多3個)"
                                    }
                                    onChange={this.onChange}
                                    error={errors.file01}
                                    limit={3}
                                    info={!isEmpty(fileInfo) ? fileInfo : []}
                                  />

                                  <small
                                    id="emailHelp"
                                    className="form-text text-muted"
                                  >
                                    *
                                    某些手機設備無法選取檔案，請在官網使用web回報
                                  </small>
                                </div>
                                {useRecaptcha && (
                                  <ReCAPTCHA
                                    sitekey="6LefP6UUAAAAAA0qZDJrLhODhk6vP0X6Gx--zbQ1"
                                    onChange={this.verifyCallback}
                                    size={useRecaptcha ? "normal" : "invisible"}
                                  />
                                )}
                                {errors.captcha_token && (
                                  <div className="invalid-feedback d-block">
                                    {errors.captcha_token}
                                  </div>
                                )}

                                <input
                                  type="submit"
                                  className="btn btn-primary btn-block"
                                  value="填好送出"
                                />
                                <Link
                                  className="btn btn-secondary btn-block"
                                  to={home_link}
                                >
                                  回到客服中心
                                </Link>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}
                      {question.status === "4" && (
                        <div className="alert alert-secondary" role="alert">
                          本提案單已經結案, 感謝您的回報。{" "}
                          <Link className="alert-link" to={home_link}>
                            回到客服中心
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }
}

QuestionView.propTypes = {
  getQuestionById: PropTypes.func.isRequired,
  insert_reply: PropTypes.func.isRequired,
  service: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  service: state.service,
  errors: state.errors
});

export default connect(mapStateToProps, { getQuestionById, insert_reply })(
  withRouter(QuestionView)
);
