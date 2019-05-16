import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaFieldGroup from "../../common/TextAreaFieldGroup";
import MobileInputGroup from "../../common/MobileInputGroup";

import SelectListGroup from "../../common/SelectListGroup";
import RadioGroup from "../../common/RadioGroup";
import FileGroup from "../../common/FileGroup";
import { createWebReport } from "../../../actions/reportActions";
import isEmpty from "../../../validation/is-empty";
import FaqPanel from "../faq/FaqPanel";

class WebForm extends Component {
  constructor(props) {
    super(props);
    //console.log(props);

    this.state = {
      server_id:
        props.game.servers.length === 1 ? props.game.servers[0].server_id : "",
      character_name: "",
      email: "",
      phone: "",
      question_type: "",
      content: "",
      errors: "",
      file01: "",
      mobile_locale: "886",

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
    //console.log(`${this.state.mobile_locale}${this.state.phone}`);

    let formData = new FormData();
    let fileArray = this.state.attachments;
    for (let index = 1; index <= fileArray.length; index++) {
      formData.append(`attachment${index}`, fileArray[index - 1]);
    }

    let phone =
      this.state.mobile_locale === "886"
        ? this.state.phone
        : `${this.state.mobile_locale}${this.state.phone}`;

    formData.append("email", this.state.email);
    formData.append("phone", phone);
    formData.append("game_id", this.props.game.game_id);
    formData.append("game_name", this.props.game.game_name);
    formData.append("server_id", this.state.server_id);
    formData.append("character_name", this.state.character_name);
    formData.append("question_type", this.state.question_type);
    formData.append("content", this.state.content);

    this.props.createWebReport(formData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    //console.log(e.target.name);
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
    const { errors, attachments, mobile_locale, question_type } = this.state;
    const { game, question_types, faq } = this.props;
    const localeOptions = [
      { label: "台灣 (+886)", value: "886", placeholder: "0912 345 678" },
      { label: "香港 (+852)", value: "852", placeholder: "5123 4567" },
      { label: "澳門 (+853)", value: "853", placeholder: "6612 3456" },
      { label: "新加坡 (+65)", value: "65", placeholder: "8123 4567" },
      { label: "馬來西亞 (+60)", value: "60", placeholder: "12 345 6789" },
      { label: "中國 (+86)", value: "86", placeholder: "131 2345 6789" }
    ];

    const phone_placeholder = localeOptions.filter(
      local => local.value === mobile_locale
    )[0].placeholder;

    let typesOption = Object.getOwnPropertyNames(question_types).map(type => ({
      label: question_types[type],
      value: type
    }));

    let serversOption = [];

    if (game.servers) {
      serversOption = game.servers
        .filter(server => server.server_status === "public")
        .map(server => ({
          label: server.server_name,
          value: server.server_id
        }));
      //console.log("serversOption", serversOption);
      if (game.servers.length > 1) {
        serversOption = [...serversOption, { label: "請選擇", value: "" }];
      }
    }

    const fileInfo = Object.keys(attachments).map(
      attach => attachments[attach].name
    );
    return (
      <form onSubmit={this.onSubmit}>
        <div>
          <TextFieldGroup
            placeholder="* Email"
            name="email"
            type="email"
            value={this.state.email}
            onChange={this.onChange}
            error={errors.email}
            info="我們將會使用email通知回報後續處理結果, 請務必正確填寫"
          />
          <MobileInputGroup
            placeholder={phone_placeholder}
            name="phone"
            type="tel"
            locale_value={this.state.mobile_locale}
            localeOptions={localeOptions}
            value={this.state.phone}
            onChange={this.onChange}
            error={errors.phone}
            info="格式為純數字, 不需任何符號"
          />
          <SelectListGroup
            placeholder="伺服器"
            name="server_id"
            value={this.state.server_id}
            onChange={this.onChange}
            error={errors.server_id}
            options={serversOption}
            info="伺服器"
          />
          <TextFieldGroup
            placeholder="角色名稱"
            name="character_name"
            type="text"
            value={this.state.character_name}
            onChange={this.onChange}
            error={errors.character_name}
            info="(選填)角色名稱"
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
)(WebForm);
