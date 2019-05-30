import React, { Component } from "react";
import SingleReply from "./SingleReply";
class ReplyContent extends Component {
  render() {
    const { replies, q_status, pic_plus, token } = this.props;
    return (
      <div>
        <h5 className="mb-2">
          <i className="fab fa-replyd mr-2 text-success" />
          處理狀態
        </h5>
        {replies.map((reply, index) => (
          <SingleReply
            key={reply.id}
            token={token}
            reply={reply}
            q_status={q_status}
            lastReply={replies.length - 1 === index}
            pics={pic_plus.filter(pic => pic.reply_id === reply.id)}
          />
        ))}
      </div>
    );
  }
}

export default ReplyContent;
