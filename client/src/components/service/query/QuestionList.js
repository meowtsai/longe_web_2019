import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Moment from "react-moment";
import queryString from "query-string";
import { connect } from "react-redux";
import { getQuestionList } from "../../../actions/questionActions";
class QuestionList extends Component {
  componentDidMount() {
    const search_values = queryString.parse(this.props.location.search);
    const q_token = search_values.token;
    this.props.getQuestionList(q_token);
  }

  render() {
    const search_values = queryString.parse(this.props.location.search);
    const q_token = search_values.token;
    const { question_list } = this.props.service;
    const q_status = {
      "1": { text: "處理中", style: "danger" },
      "2": { text: "已回覆", style: "info" },
      "4": { text: "結案", style: "success" },
      "7": { text: "已回覆", style: "info" }
    };

    return (
      <div>
        <nav className="navbar navbar-dark bg-dark">
          <div className="container text-center">
            <span className="navbar-brand mb-0 h1 navbar-text  m-auto">
              客服中心 >回報紀錄
            </span>
          </div>
        </nav>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-6 m-auto">
              <div className="card">
                <div className="card-body">
                  <p className="card-text">案件資訊(點選可查看進一步訊息)</p>
                </div>
                <ul className="list-group list-group-flush">
                  {question_list.length > 0 &&
                    question_list.map(q => (
                      <li className="list-group-item mb-2" key={q.id}>
                        <div className="d-flex w-100 justify-content-between">
                          <strong>
                            #
                            <Link
                              to={`/service/${
                                this.props.match.params.game_id
                              }/view/${q.id}?token=${q_token}`}
                            >
                              {q.id} <i className="fas fa-search" />
                            </Link>
                            {q.status === "2" && q.is_read !== "1" && (
                              <span class="badge badge-light">未讀</span>
                            )}
                          </strong>

                          <small className="text-muted">
                            <Moment format="YYYY/MM/DD HH:mm">
                              {q.create_time}
                            </Moment>
                          </small>
                        </div>
                        <div className="d-flex w-100 justify-content-between">
                          <p className="text-lead">
                            <span
                              className={`badge badge-${
                                q_status[q.status].style
                              } mr-3`}
                            >
                              {q_status[q.status].text}
                            </span>

                            <span
                              className="card-text small"
                              style={{ overflowWrap: "break-word" }}
                              dangerouslySetInnerHTML={{
                                __html: q.content
                              }}
                            />
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

QuestionList.propTypes = {
  getQuestionList: PropTypes.func.isRequired,

  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  errors: state.errors,
  service: state.service
});
export default connect(
  mapStateToProps,
  { getQuestionList }
)(QuestionList);
