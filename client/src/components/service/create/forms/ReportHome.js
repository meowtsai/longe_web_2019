import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import { connect } from "react-redux";
import isEmpty from "../../../../validation/is-empty";
import classnames from "classnames";
import queryString from "query-string";
import PropTypes from "prop-types";
import TopUpNotReceivedForm from "../custom_forms/TopUpNotReceivedForm";
import GeneralForm from "../custom_forms/GeneralForm";
import { renderForm, createWebReport } from "../../../../actions/reportActions";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import Spinner from "../../../common/Spinner";
ReactModal.setAppElement("#root");
const ReportHome = ({
  report,
  service,
  match,
  location,
  history,
  renderForm,
  createWebReport,
}) => {
  const { register, handleSubmit, watch, errors } = useForm();

  const search_values = queryString.parse(location.search);
  const form_id = search_values.form_id;
  const issue_options = [
    { label: "儲值扣款後未收到商品", value: "topup_not_received" },
    { label: "我的帳號遺失,無法登入原本角色", value: "account_lost" },
    { label: "帳號被盜用了", value: "account_compromised" },
    { label: "其他問題", value: "general_issue" },
  ];
  const form_label = issue_options.filter((i) => i.value === form_id)[0].label;

  const [mobileLocale, setMobileLocale] = useState("886");
  const [captchaToken, setCaptchaToken] = useState("");
  //const [showModal, setShowModal] = useState(false);

  const got_char = watch("got_char");

  const { user, game, loading, question_types } = report.settings;
  const { question_id, check_id } = report.create_result;
  const onSubmit = (data) => {
    let formData = new FormData();
    if (form_id === "topup_not_received") {
      formData.append("question_type", 2);
      formData.append(
        "content",
        `我要回報［${form_label}］
        相關資料如下:
        1. 伺服器名稱:${
          game.servers.filter((s) => s.server_id === data.server_id)[0]
            .server_name
        }
      2. 帳號ID: ${data.account} 
      3. 角色ID:${data.roleId} 
      4. 交易時間:${data.trxTime}  
      5. 訂單編號 :${data.trxId}
      6. 購買品項名稱 :${data.productName}
      7. 未收到的商品名稱 :${data.productNotReceived}
      `
      );

      formData.append(`attachment1`, data.receiptFile[0]);
      formData.append(`attachment2`, data.smsFile[0]);
    } else {
      formData.append("question_type", data.question_type);
      formData.append("content", data.content);

      let fileArray = data.file01;
      for (let index = 1; index <= fileArray.length; index++) {
        formData.append(`attachment${index}`, fileArray[index - 1]);
      }
    }

    formData.append("email", data.email);
    formData.append(
      "phone",
      mobileLocale === "886" ? data.phone : `${mobileLocale}${data.phone}`
    );

    formData.append("server_id", data.server_id);
    formData.append("character_name", data.character_name);
    formData.append("game_id", game.game_id);
    formData.append("game_name", game.game_name);
    formData.append("captcha_token", captchaToken);

    createWebReport(formData, history);
  };

  const localeOptions = [
    { label: "台灣 (+886)", value: "886", placeholder: "0912 345 678" },
    { label: "香港 (+852)", value: "852", placeholder: "5123 4567" },
    { label: "澳門 (+853)", value: "853", placeholder: "6612 3456" },
    { label: "新加坡 (+65)", value: "65", placeholder: "8123 4567" },
    { label: "馬來西亞 (+60)", value: "60", placeholder: "12 345 6789" },
    { label: "中國 (+86)", value: "0086", placeholder: "131 2345 6789" },
  ];

  let custom_content;
  let serversOption = [];

  if (!question_id) {
    switch (form_id) {
      case "topup_not_received":
        custom_content = (
          <TopUpNotReceivedForm register={register} errors={errors} />
        );
        break;

      default:
        custom_content = (
          <GeneralForm
            register={register}
            errors={errors}
            question_types={question_types || {}}
            watch={watch}
          />
        );

        break;
    }
  }

  const handleCloseModal = () => {
    //setShowModal(false);

    history.push(
      `/service/${match.params.game_id}/view/${report.create_result.question_id}?token=${report.create_result.token}`
    );
  };

  useEffect(() => {
    console.log("renderForm useEffect", report);
    document.title = "龍邑遊戲|客服回報單";
    renderForm(match.params.game_id, search_values.token);
    // eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   console.log('report useEffect', report);
  //   if (report) {
  //     if (report.create_result.question_id) {
  //       setShowModal(true);
  //     } else {
  //       //setShowModal(false);
  //     }
  //   }
  // }, [report]);

  if (report.settings.game) {
    if (game.servers) {
      //console.log('useEffect game.servers', game.servers);
      serversOption = game.servers
        .filter((server) => server.server_status === "public")
        .map((server) => ({
          label: server.server_name,
          value: server.server_id,
        }));
      //console.log("serversOption", serversOption);
      if (game.servers.length > 1) {
        serversOption = [{ label: "請選擇", value: "" }, ...serversOption];
      }
    }
  }
  if (loading) return <Spinner />;
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3 mt-3"> </div>
        <div className="col-lg-6  col-sm-12  mt-3">
          <button
            onClick={(e) => history.goBack()}
            className="btn btn-outline-secondary"
          >
            取消
          </button>
          <h5 className="text-center mt-5">{game && game.game_name}</h5>
          <h4 className="text-center ">［{form_label}］回報單</h4>
          <small className="d-block mb-3 text-center text-danger">
            請確實填寫以下資料, 以加速問題處理流程{" "}
          </small>

          <div className="card bg-light mb-3">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label className="small text-primary">Email</label>
                  <input
                    type="email"
                    className={classnames("form-control form-control-md", {
                      "is-invalid": errors.email,
                    })}
                    name="email"
                    ref={register({ required: true })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">請輸入您的email</div>
                  )}
                  <small id="emailHelp" className="form-text text-muted">
                    我們將會使用email通知回報後續處理結果, 請務必正確填寫
                  </small>
                </div>
                <div className="form-row">
                  <label
                    className="small text-primary"
                    htmlFor="inlineFormInputLocale"
                  >
                    手機
                  </label>
                </div>
                <div className="form-row">
                  <div className="col-sm-4 my-1">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-globe-asia" />
                        </span>
                      </div>
                      <select
                        className="form-control form-control-md"
                        name="mobile_locale"
                        value={mobileLocale}
                        onChange={(e) => setMobileLocale(e.target.value)}
                      >
                        {localeOptions.map((option) => (
                          <option key={option.label} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-8 my-1">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-mobile-alt" />
                        </span>
                      </div>

                      <input
                        type="text"
                        className={classnames("form-control form-control-md", {
                          "is-invalid": errors.phone,
                        })}
                        placeholder={
                          localeOptions.filter(
                            (local) => local.value === mobileLocale
                          )[0].placeholder
                        }
                        name="phone"
                        ref={register({ required: true })}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="small text-primary" htmlFor="serverSelect">
                    伺服器
                  </label>
                  <select
                    className={classnames("form-control form-control-md", {
                      "is-invalid": errors.server_id,
                    })}
                    name="server_id"
                    ref={register({ required: true })}
                  >
                    {serversOption.map((server) => (
                      <option
                        key={`server-${server.value}`}
                        value={server.value}
                      >
                        {server.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label className="small text-primary">角色名稱</label>
                </div>
                <div className="form-row">
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className={classnames("form-control form-control-md", {
                        "is-invalid": errors.character_name,
                      })}
                      name="character_name"
                      ref={register({ required: !got_char })}
                      readOnly={got_char}
                      placeholder={got_char ? "" : "請輸入角色名稱"}
                    />
                  </div>
                  <div className="col-auto  my-1">
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="got_char"
                        ref={register}
                      />
                      <label className="form-check-label">我沒有角色</label>
                    </div>
                  </div>
                </div>

                {custom_content}

                <ReCAPTCHA
                  sitekey="6LefP6UUAAAAAA0qZDJrLhODhk6vP0X6Gx--zbQ1"
                  onChange={(token) => setCaptchaToken(token)}
                  size="normal"
                />
                <div className="form-group mt-3">
                  <input
                    type="submit"
                    value="送出"
                    className="btn btn-info btn-block"
                  />{" "}
                </div>
              </form>

              <ReactModal
                isOpen={question_id ? true : false}
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
                      onClick={handleCloseModal}
                      className="btn btn-primary m-auto"
                    >
                      確認
                    </button>
                  </div>
                </div>
              </ReactModal>
            </div>
            <div className="card-footer text-muted"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

ReportHome.propTypes = {
  renderForm: PropTypes.func.isRequired,
  createWebReport: PropTypes.func.isRequired,
  //errors: PropTypes.object
};
const mapStateToProps = (state) => ({
  report: state.report,
  //errors: state.errors,
  service: state.service,
});
export default connect(mapStateToProps, { renderForm, createWebReport })(
  ReportHome
);
