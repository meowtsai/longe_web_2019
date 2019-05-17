import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaFieldGroup from "../../common/TextAreaFieldGroup";
import RadioGroup from "../../common/RadioGroup";
import FileGroup from "../../common/FileGroup";
import { createWebReport } from "../../../actions/reportActions";
import isEmpty from "../../../validation/is-empty";
import FaqPanel from "../faq/FaqPanel";

class InGameForm extends Component {
  constructor(props) {
    super(props);
    console.log("InGameForm", props);

    this.state = {
      server_id: "",
      character_name: "",
      email: "",
      partner_uid: "",
      question_type: "",
      content: "",
      errors: "",
      file01: "",
      attachments: [],
      loading: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const { user } = this.props;
    let formData = new FormData();
    let fileArray = this.state.attachments;
    for (let index = 1; index <= fileArray.length; index++) {
      formData.append(`attachment${index}`, fileArray[index - 1]);
    }

    formData.append("email", this.state.email);
    formData.append("partner_uid", user.partner_uid);
    formData.append("game_id", this.props.game.game_id);
    formData.append("game_name", this.props.game.game_name);
    formData.append("server_id", user.server_info.server_id);
    formData.append("character_name", user.character_name);
    formData.append("question_type", this.state.question_type);
    formData.append("content", this.state.content);

    this.props.createWebReport(formData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    //console.log(e.target.files);
    if (!isEmpty(e.target.files)) {
      if (Object.keys(e.target.files).length > 6) {
        this.setState({
          file01: "",
          errors: { file01: "請勿選取超過6個檔案" },
          attachments: []
        });
      } else {
        this.setState({ errors: {}, attachments: e.target.files });
      }
    }
  }
  render() {
    const { errors, attachments, question_type } = this.state;
    const { question_types, user, faq } = this.props;
    //let question_types = {};
    let typesOption = Object.getOwnPropertyNames(question_types).map(type => ({
      label: question_types[type],
      value: type
    }));

    const fileInfo = Object.keys(attachments).map(
      attach => attachments[attach].name
    );
    return (
      <form onSubmit={this.onSubmit}>
        <div>
          <div className="form-group">
            <label className="text-primary">
              <strong>伺服器：{user.server_info.server_name}</strong>
            </label>
            <input
              type="hidden"
              name="partner_uid"
              id="partner_uid"
              value={user.partner_uid}
            />
            <input
              type="hidden"
              name="server_id"
              id="server_id"
              value={user.server_info.server_id}
            />
          </div>

          <div className="form-group">
            <label className="text-primary">
              <strong>角色名稱：{user.character_name}</strong>
            </label>

            <input
              type="hidden"
              name="character_name"
              id="character_name"
              value={user.character_name}
            />
          </div>

          <TextFieldGroup
            placeholder="(選填)Email"
            name="email"
            type="email"
            value={this.state.email}
            onChange={this.onChange}
            error={errors.email}
            info="若您留下信箱，您就可以收到電子郵件回覆通知。"
          />
        </div>

        <RadioGroup
          name="question_type"
          value={this.state.question_type}
          onChange={this.onChange}
          error={errors.question_type}
          options={typesOption}
          info="問題類型"
        />

        <TextAreaFieldGroup
          placeholder="* 問題描述"
          name="content"
          value={this.state.content}
          onChange={this.onChange}
          error={errors.content}
          info="請詳細描述您所遇到的遊戲問題"
        />
        <FaqPanel faq={faq} question_type={question_type} />

        <FileGroup
          name="file01"
          filename={
            !isEmpty(fileInfo)
              ? `已選取${Object.keys(attachments).length}個`
              : "附件(最多6個)"
          }
          onChange={this.onChange}
          error={errors.file01}
          limit={6}
          info={!isEmpty(fileInfo) ? fileInfo : []}
        />

        <input type="submit" value="送出" className="btn btn-info btn-block" />
        <Link
          to={`/service/${this.props.game.game_id}`}
          className="btn btn-secondary btn-block"
        >
          取消
        </Link>
      </form>
    );
  }
}
const mapStateToProps = state => ({
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { createWebReport }
)(InGameForm);
