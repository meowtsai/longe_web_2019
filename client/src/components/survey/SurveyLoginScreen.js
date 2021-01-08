import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import ReportInput from "../vip/v2/ReportInput";
const SurveyLoginScreen = ({ match }) => {
  const game_id = match.params.game_id;

  //const formId = game_id === "h55" ? "v3TcJodB6ttwRhMi9" : "GMMj4K6gc39VW6dm8";
  const formId =
    game_id === "h55"
      ? "1FAIpQLSf_pWteJjMefHoUAb_NFSSwFSDkrqiyxxNGgPTKlIxeE3ymwQ"
      : "1FAIpQLSfLSZrK_xuzJzkbW3U1yjbxlXI2oBbGbcU-mrJyX74AfG0Qmw";

  const bgcolor = game_id === "h55" ? "#C7D2D6" : "#E6E6FA";
  const role_id_label = game_id === "h55" ? "角色ID" : "帳號ID";
  const [hint, setHint] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [verifiedRecord, setVerifiedRecord] = useState(null);
  const [loadCount, setLoadCount] = useState(0);

  const { register, handleSubmit, errors } = useForm(); // initialise the hook

  const loaded = (e) => {
    setLoadCount(loadCount + 1);
    if (loadCount > 0) {
      document
        .getElementsByTagName("iframe")[0]
        .setAttribute("height", "300px");
      window.scrollTo(315, 0);
    }
  };

  const onSubmit = (data) => {
    //console.log(data);

    axios
      .post("/api/events/surveylogin", {
        ...data,
        gameId: game_id === "h55" ? "h55naxx2tw" : "g66naxx2tw",
      })
      .then((res) => {
        //console.log(res.data);
        setVerifiedRecord(res.data);
      })
      .catch((err) => {
        //console.log(err.response.data);
        setErrorMessage(err.response.data.message);
      });
  };

  return (
    <div className="container">
      <div className="row">
        {!verifiedRecord && (
          <div className="col-md-9 col-sm">
            <TitlePart
              title={"龍邑專屬服務問卷調查活動"}
              desc={`親愛的專屬會員您好！歡迎您參加本次問卷調查活動！
 擁有專屬資格的會員在完成問卷且驗證有效後，將會透過EMAIL發送 150 點 MYCARD 點數卡給您！
 還請會員們填寫真實建議，再次感謝您的寶貴意見與支持😊
 ※每個資格會員，限領乙組點數卡。
 `}
            />
            <form
              className="card border-primary mb-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="card-body">
                <div className="card-text">
                  <div className="form-group col-md-6 col-sm">
                    <ReportInput
                      name="roleId"
                      label={role_id_label}
                      symbol="🔢"
                      register={register({
                        pattern: {
                          value: /^\d{6,8}$/,
                          message: "請輸入6~8碼數字",
                        },
                        required: `請輸入${role_id_label}`,
                      })}
                      placeholder="輸入角色ID"
                      error={errors.roleId}
                    />
                    <small
                      id="roleIdHelp"
                      className="form-text text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => setHint("gameid")}
                    >
                      💡 在遊戲設定中可以找到{role_id_label}(如圖)
                    </small>
                  </div>
                  <div className="form-group col-md-6 col-sm">
                    <ReportInput
                      name="accountId"
                      label={"用戶中心帳號ID"}
                      symbol="🆔"
                      register={register({
                        pattern: {
                          value: /^\d{9}$/,
                          message: "請輸入9碼數字",
                        },
                        required: "請輸入用戶中心帳號ID",
                      })}
                      placeholder="輸入用戶中心帳號ID"
                      error={errors.accountId}
                    />

                    <small
                      id="accountIdHelp"
                      className="form-text text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => setHint("accountid")}
                    >
                      💡 在登入主畫面及帳號設定中可以找到用戶中心帳號(如圖)
                    </small>
                  </div>
                  {errorMessage && (
                    <small className="text-danger d-block">
                      {errorMessage}
                    </small>
                  )}

                  <button type="submit" className="btn btn-primary float-right">
                    開始填寫問卷
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {verifiedRecord && (
          <div className="col-md-9 col-sm">
            <div
              className="alert alert-success mt-2"
              role="alert"
              style={{
                lineHeight: "32px",
                whiteSpace: "pre-line",
                backgroundColor: bgcolor,
              }}
            >
              <h4 className="alert-heading">專屬會員 您好! </h4>
              <p>
                您的角色名稱 {verifiedRecord.record.char_name}，角色ID是{" "}
                {verifiedRecord.record.char_in_game_id}
                <br />
                誠摯邀請您完成以下問卷，
                <br />
                請在驗證碼一欄填入
                <strong>
                  <u>{verifiedRecord.code}</u>
                </strong>
                <br />
                好讓我們辨識問卷填寫者的身分．
                <br />
                我們在驗證問卷有效之後將透過EMAIL發送 150 點 MYCARD
                點數卡給您！　
                <br />
              </p>
              <hr />
              <p className="mb-0">
                {verifiedRecord.status === 2 && (
                  <small className="text-danger">
                    {" "}
                    ※每個資格會員，限領乙組點數卡。若您已經填寫過本問卷請勿重複發送以免影響問卷有效性!{" "}
                    <br />
                  </small>
                )}
                預計發送日期為 2021/02/22，感謝您撥冗提供寶貴意見．
              </p>

              <iframe
                src={`https://docs.google.com/forms/d/e/${formId}/viewform?embedded=true`}
                height="4000px"
                width="100%"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                onLoad={(e) => loaded(e)}
              >
                Loading…
              </iframe>
            </div>
          </div>
        )}
      </div>
      {hint && (
        <HowToBox
          optionId={hint}
          clearHint={() => setHint(null)}
          game_id={game_id}
        />
      )}
    </div>
  );
};

export default SurveyLoginScreen;

const TitlePart = ({ title, desc }) => {
  return (
    <div
      className="card m-1"
      style={{ lineHeight: "32px", whiteSpace: "pre-line" }}
    >
      <div className="card-body">
        <div className="card-title h4">{title}</div>
        <div className="card-text">{desc}</div>
      </div>
    </div>
  );
};

const CheckMemberIDForm = ({ game_id, onClick }) => {
  return (
    <div
      className="card m-1"
      style={{ lineHeight: "32px", whiteSpace: "pre-line" }}
    ></div>
  );
};

const HowToBox = ({ optionId, clearHint, game_id }) => {
  //console.log("HowToLineID", optionId);
  //options : wrap_game_id, wrap_game_name,wrap_line_id

  return (
    <div className="wrap" id={optionId}>
      <div className="wrap-con">
        <p>
          {optionId === "gameid"
            ? game_id === "h55"
              ? "角色ID"
              : "帳號ID"
            : "用戶中心帳號ID"}
        </p>
        <i onClick={clearHint}></i>
        <div className="meg">
          <img src={`/guide/${game_id + optionId}.jpg`} alt="" />
        </div>
      </div>
    </div>
  );
};
