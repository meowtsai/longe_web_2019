import React, { Component } from "react";
import * as showdown from "showdown";
import classnames from "classnames";
import "./faq.css";
class FaqItem extends Component {
  state = {
    itemDisplay: false
  };
  onClick = () => {
    this.setState({ itemDisplay: !this.state.itemDisplay });
  };
  render() {
    const item = this.props.item;
    const { itemDisplay } = this.state;

    const sdConverter = new showdown.Converter();
    sdConverter.setOption("simpleLineBreaks", true);
    return (
      <div className="faq-item">
        <div className="item-header" onClick={this.onClick}>
          <h6 className="border-bottom border-gray pb-2 mb-0">
            <i className="fas fa-arrow-circle-right mr-3" />
            {item.title.replace("※", "")}
          </h6>
        </div>

        <div
          className={classnames(
            "item-body text-gray-dark",
            {
              "faq-item-box": !itemDisplay
            },
            {
              "faq-item-box-display": itemDisplay
            }
          )}
        >
          <p
            className="card-text small"
            dangerouslySetInnerHTML={{
              __html: sdConverter.makeHtml(item.content)
            }}
          />
        </div>
      </div>
    );
  }
}

export default FaqItem;
