import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "../../../validation/is-empty";
import FaqItem from "./FaqItem";

class FaqPanel extends Component {
  render() {
    const { faq, question_type } = this.props;
    let faq_content;

    if (!isEmpty(question_type)) {
      faq_content = faq
        .filter(item => item.type_id === question_type)
        .map(item => <FaqItem key={item.id} item={item} />);
    }
    return (
      <div className="card m-3">
        {question_type && (
          <div className="card-body">
            <h5 className="card-title">FAQ</h5>
            {isEmpty(faq_content) ? (
              <small className="text-muted">無相關資訊</small>
            ) : (
              faq_content
            )}
          </div>
        )}
      </div>
    );
  }
}

FaqPanel.propTypes = {
  faq: PropTypes.array.isRequired
};

export default FaqPanel;
