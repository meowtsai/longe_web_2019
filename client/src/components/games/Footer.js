import React, { Component } from "react";
import * as moment from "moment";
import Moment from "react-moment";
import { Link } from "react-router-dom";
class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="footer_container">
          Long E Co., Ltd © <Moment format="YYYY">{moment()}</Moment> Copyrights
          Reserved.
          <Link to="member/complete_agreement_service">會員服務條款</Link>
          <Link to="member/complete_agreement_data_use">個資同意書</Link>
          <Link to="member/complete_agreement_privacy">隱私權政策</Link>
        </div>
      </div>
    );
  }
}

export default Footer;
