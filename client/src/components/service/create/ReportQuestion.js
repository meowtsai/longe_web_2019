import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactModal from "react-modal";
import { Link } from "react-router-dom";
import { renderForm } from "../../../actions/reportActions";
import Spinner from "../../common/Spinner";
import queryString from "query-string";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaFieldGroup from "../../common/TextAreaFieldGroup";
import RadioGroup from "../../common/RadioGroup";
import SelectListGroup from "../../common/SelectListGroup";
import FileGroup from "../../common/FileGroup";
import { createWebReport } from "../../../actions/reportActions";
import isEmpty from "../../../validation/is-empty";
import FaqPanel from "../faq/FaqPanel";
import MobileInputGroup from "../../common/MobileInputGroup";

import ReCAPTCHA from "react-google-recaptcha";
ReactModal.setAppElement("#root");

class ReportQuestion extends Component {
  constructor(props) {
    //console.log("ReportQuestion", props);
    super(props);
    this.state = {
      server_id: "",
      got_char: "yes",
      character_name: "",
      email: "",
      phone: "",
      partner_uid: "",
      question_type: "",
      content: "",
      errors: "",
      file01: "",
      mobile_locale: "886",
      captcha_token: "",

      attachments: [],
      loading: false,
      showModal: false,
      token: ""
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });

    this.props.history.push(
      `/service/${this.props.match.params.game_id}/view/${
        this.props.report.create_result.question_id
      }?token=${
        isEmpty(this.props.report.settings.user)
          ? this.props.report.create_result.token
          : this.state.token
      }`
    );
  }

  onSubmit(e) {
    e.preventDefault();
    const { user, game } = this.props.report.settings;
    let formData = new FormData();
    let fileArray = this.state.attachments;
    for (let index = 1; index <= fileArray.length; index++) {
      formData.append(`attachment${index}`, fileArray[index - 1]);
    }

    formData.append("email", this.state.email);
    formData.append("got_char", this.state.got_char);
    if (user) {
      formData.append("partner_uid", user.partner_uid);
      formData.append("server_id", user.server_info.server_id);
      formData.append("character_name", user.character_name);
      formData.append("note", user.q_note);
    } else {
      let phone =
        this.state.mobile_locale === "886"
          ? this.state.phone
          : `${this.state.mobile_locale}${this.state.phone}`;
      formData.append("phone", phone);

      formData.append(
        "server_id",
        game.servers.length === 1
          ? game.servers[0].server_id
          : this.state.server_id
      );

      formData.append("character_name", this.state.character_name);
    }
    formData.append("game_id", game.game_id);
    formData.append("game_name", game.game_name);
    formData.append("question_type", this.state.question_type);
    formData.append("content", this.state.content);
    formData.append("captcha_token", this.state.captcha_token);

    //console.log("formData", formData);

    this.props.createWebReport(formData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    //console.log(e.target.name, e.target.value);
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

  verifyCallback(recaptchaToken) {
    this.setState({ captcha_token: recaptchaToken });
  }

  componentDidMount() {
    const search_values = queryString.parse(this.props.location.search);

    this.setState({ token: search_values.token });

    this.props.renderForm(this.props.match.params.game_id, search_values.token);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.report) {
      if (nextProps.report.create_result.question_id) {
        this.handleOpenModal();
      } else {
        this.setState({ showModal: false });
      }

      //this.setState({ question: nextProps.service.question });
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  render() {
    const { game, question_types, user, faq } = this.props.report.settings;

    const { loading } = this.props.report;
    const { question_id, check_id } = this.props.report.create_result;

    const {
      errors,
      attachments,
      question_type,
      mobile_locale,
      token
    } = this.state;

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

    const fileInfo = Object.keys(attachments).map(
      attach => attachments[attach].name
    );
    const home_link = !isEmpty(user)
      ? `/service_quick?token=${token}`
      : `/service_quick?param_game_id=${this.props.match.params.game_id}`;

    let formContent;
    let typesOption = [];
    if (game && question_types) {
      typesOption = Object.getOwnPropertyNames(question_types).map(type => ({
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
      if (user) {
        formContent = (
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
              placeholder="* Email"
              name="email"
              type="email"
              value={this.state.email}
              onChange={this.onChange}
              error={errors.email}
              info="我們將會使用email通知回報後續處理結果, 請務必正確填寫"
            />
          </div>
        );
      } else {
        formContent = (
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

            <div className="custom-control custom-radio">
              <input
                className="custom-control-input"
                type="radio"
                name="got_char"
                id="got_char_yes"
                value="yes"
                onChange={this.onChange}
                checked={this.state.got_char === "yes" ? true : false}
              />
              <label className="custom-control-label" for="got_char_yes">
                我有角色
              </label>
              {this.state.got_char === "yes" && (
                <TextFieldGroup
                  placeholder="* 角色名稱"
                  name="character_name"
                  type="text"
                  value={this.state.character_name}
                  onChange={this.onChange}
                  error={errors.character_name}
                  info="請填寫角色名稱"
                />
              )}
            </div>
            <div className="custom-control custom-radio mb-3">
              <input
                className="custom-control-input"
                type="radio"
                name="got_char"
                id="got_char_no"
                value="no"
                onChange={this.onChange}
                checked={this.state.got_char === "no" ? true : false}
              />{" "}
              <label className="custom-control-label" for="got_char_no">
                我沒有角色(或是我忘了角色名稱)
              </label>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-9 col-lg-6 m-auto">
            <h4 className="text-center mt-5">線上回報</h4>
            <small className="d-block mb-3 text-center">請填寫以下資訊</small>

            {loading ? (
              <Spinner />
            ) : (
              <div>
                <form onSubmit={this.onSubmit}>
                  {formContent}
                  <RadioGroup
                    name="question_type"
                    value={this.state.question_type}
                    onChange={this.onChange}
                    error={errors.question_type}
                    options={typesOption}
                    info="問題類型"
                  />
                  <FaqPanel faq={faq} question_type={question_type} />
                  <TextAreaFieldGroup
                    placeholder="* 問題描述"
                    name="content"
                    value={this.state.content}
                    onChange={this.onChange}
                    error={errors.content}
                    info="請詳細描述您所遇到的遊戲問題"
                  />

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
                  <ReCAPTCHA
                    sitekey="6LefP6UUAAAAAA0qZDJrLhODhk6vP0X6Gx--zbQ1"
                    onChange={this.verifyCallback}
                  />

                  {errors.captcha_token && (
                    <div className="invalid-feedback d-block">
                      {errors.captcha_token}
                    </div>
                  )}

                  <input
                    type="submit"
                    value="送出"
                    className="btn btn-info btn-block"
                  />
                  <Link to={home_link} className="btn btn-secondary btn-block">
                    取消
                  </Link>
                </form>
                <ReactModal
                  isOpen={this.state.showModal}
                  contentLabel=""
                  style={{ overlay: { zIndex: 10 } }}
                >
                  <h3 className="text-center">客服中心 提問結果</h3>
                  <hr />
                  <div className="row">
                    <div className="col-sm-12 col-md-4 m-auto">
                      <div className="alert alert-success">
                        <strong>回報單 #{question_id} 提問成功</strong>
                        {isEmpty(user) && (
                          <div>
                            <br />
                            我們已經傳送郵件到您的mail，
                            <br />
                            後續追蹤客服請用提問mail或手機及以下代碼查詢：
                            <font color="red">
                              <b>{check_id}</b>
                            </font>
                            <br />
                            <font color="red">
                              註:專員將會回覆至<strong>回報紀錄</strong>
                              頁面給您，務必自行前往查看。
                            </font>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={this.handleCloseModal}
                        className="btn btn-primary m-auto"
                      >
                        確認
                      </button>
                    </div>
                  </div>
                </ReactModal>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

ReportQuestion.propTypes = {
  renderForm: PropTypes.func.isRequired,
  createWebReport: PropTypes.func.isRequired,
  errors: PropTypes.object
};
const mapStateToProps = state => ({
  report: state.report,
  errors: state.errors,
  service: state.service
});
export default connect(
  mapStateToProps,
  { renderForm, createWebReport }
)(ReportQuestion);
