import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import Moment from "react-moment";
import { stillInDoubt, closeQuestion } from "../../../actions/questionActions";
import * as showdown from "showdown";

class SingleReply extends Component {
  render() {
    const { reply, lastReply, q_status, pics, token } = this.props;
    return (
      <div
        className={classnames("card mb-3", {
          "border-success": reply.is_official === "1",
          "border-info": reply.is_official !== "1"
        })}
      >
        <div
          className={classnames("card-body", {
            "text-success": reply.is_official === "1",
            "text-info": reply.is_official !== "1"
          })}
        >
          <p
            className="card-text"
            dangerouslySetInnerHTML={{
              __html: new showdown.Converter().makeHtml(reply.content)
            }}
          />

          {pics.length > 0 && (
            <div className="btn-group">
              {pics.map((pic, idx) => (
                <a
                  key={pic.id}
                  href={pic.pic_path}
                  className="btn btn-sm btn-outline-secondary"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  附圖{idx + 1}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="card-footer text-muted small">
          {reply.is_official === "1" ? "客服中心" : "再次提問"}@
          <Moment format="YYYY/MM/DD HH:mm">{reply.create_time}</Moment>
        </div>

        {reply.is_official === "1" && lastReply && q_status !== "4" && (
          <div className="p-lg-3">
            <hr />
            <button
              className="btn btn-info btn-block"
              onClick={this.props.closeQuestion.bind(
                this,
                reply.question_id,
                token
              )}
            >
              <i className="far fa-check-circle mr-3" />
              我沒問題了，結案
            </button>
            <small className="text-muted mr-3 m-auto">
              * 若對本提問單還有疑問請於下方<strong>再次提問</strong>
            </small>
          </div>
        )}
        {reply.is_official === "0" && lastReply && (
          <div className="alert alert-warning fade show" role="alert">
            <strong>提問已經送出!</strong>{" "}
            請耐心等候，我們查明之後將盡快回覆您。
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  null,
  { stillInDoubt, closeQuestion }
)(SingleReply);
