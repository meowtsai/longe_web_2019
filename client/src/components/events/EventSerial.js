import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import queryString from "query-string";
import Spinner from "../common/Spinner";
import { loadUser, redeemSerial } from "../../actions/eventActions";
import TextFieldGroup from "../common/TextFieldGroup";
import RedeemRecords from "./RedeemRecords";
import Alert from "../common/Alert";
const EventSerial = props => {
  const [serial_no, setSerail] = useState("");
  const [warning, setWarning] = useState(false);
  const search_values = queryString.parse(props.location.search);
  const event_id = search_values.event_id;
  const token = search_values.token;

  const {
    event: { user, event, loading, logs, redeem_msg, redeem_status },
    errors
  } = props;

  useEffect(() => {
    //console.log("useEffect called");
    props.loadUser(event_id, token);
  }, []);

  //console.log("errors", errors);

  const onRedeem = e => {
    //console.log("click redeem");
    setWarning(false);
    if (serial_no === "" || serial_no.length < 8) {
      setWarning(true);
      return;
    }

    props.redeemSerial(event_id, token, serial_no);
  };

  if (!token || !event_id || errors.msg === "活動不存在") {
    return <div>錯誤操作請關閉視窗，重新開始客服回報流程</div>;
  }

  if (errors.jwt) {
    return <div>操作逾時請關閉視窗，重新開始客服回報流程</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-9 col-lg-6 m-auto">
          <h4 className="text-center mt-5">
            <i className="fas fa-chess-queen mr-3" />
            兌獎中心
            <i className="fas fa-chess-queen ml-3" />
          </h4>
          <small
            className={`d-block mb-3 text-center ${
              warning ? "font-weight-bold text-danger" : ""
            }`}
          >
            請輸入序號已完成兌換程序 <br />
            建議用複製以免多次錯誤被鎖定
          </small>
          {loading ? (
            <Spinner />
          ) : (
            <div>
              {errors.msg && <Alert msg={errors.msg} />}
              {redeem_msg && <Alert msg={redeem_msg} type="success" />}

              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th nowrap="true" scope="col">
                      活動名稱
                    </th>
                    <td>
                      <span>{event.event_name}</span>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">伺服器</th>
                    <td>{user.server_info && user.server_info.server_name}</td>
                  </tr>
                  <tr>
                    <th scope="row">角色名稱</th>
                    <td>{user.character_name}</td>
                  </tr>
                  <tr>
                    <th scope="row">角色ID</th>
                    <td>{user.in_game_id}</td>
                  </tr>

                  {redeem_status === "NORMAL" && (
                    <Fragment>
                      <tr className="bg-warning text-dark">
                        <th scope="row">序號</th>
                        <td>
                          <TextFieldGroup
                            placeholder="* 序號"
                            name="serial_no"
                            type="serial_no"
                            value={serial_no}
                            onChange={e => {
                              setSerail(e.target.value);
                            }}
                            error={errors.serial_no}
                            info="請輸入兌換序號"
                          />
                        </td>
                      </tr>
                      <tr className="bg-warning text-dark">
                        <td colSpan="2">
                          <div className="text-center">
                            <Link
                              to={`/service_quick?token=${token}`}
                              className="btn btn-secondary  col-4"
                            >
                              <i className="fas fa-sign-out-alt mr-3" />
                              取消
                            </Link>
                            <button
                              onClick={onRedeem}
                              className="btn btn-info  ml-3 col-4"
                            >
                              <i className="fas fa-check mr-3" />
                              送出
                            </button>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  )}

                  {redeem_status === "COMPLETED" && (
                    <tr className="bg-light text-success">
                      <td colSpan="2">
                        <div className="text-center">
                          您已經完成兌換，請參見下方紀錄和說明。
                          <Link
                            to={`/service_quick?token=${token}`}
                            className="btn btn-secondary  col-4"
                          >
                            <i className="fas fa-sign-out-alt ml-3" />
                            回客服首頁
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}

                  {redeem_status === "REACH_LIMITED" && (
                    <tr className="bg-light text-danger">
                      <td colSpan="2">
                        <div className="text-center">
                          抱歉，您輸入錯誤次數已經超過上限。
                          <Link
                            to={`/service_quick?token=${token}`}
                            className="btn btn-secondary  col-4"
                          >
                            <i className="fas fa-sign-out-alt ml-3" />
                            回客服首頁
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td colSpan="2">
                      {logs.length > 0 && <RedeemRecords logs={logs} />}
                      <fieldset className="m-3">
                        <legend>
                          {" "}
                          <i className="fas fa-clipboard mr-2 text-info" />{" "}
                          使用注意事項
                        </legend>

                        <ul className="m-3 small">
                          <li style={liStyle}>
                            本序號僅提供《超機動聯盟》亞洲服玩家兌換。
                          </li>
                          <li style={liStyle}>
                            序號可至遊戲app登錄頁→客服→線上回報→問題類型：MyCard儲值活動獎勵或新手禮包→填寫表單內容→送出。
                          </li>
                          <li style={liStyle}>
                            序號可兌換期限至 2019/11/30 晚上 23：59 止。
                          </li>
                          <li style={liStyle}>
                            <b>
                              <u>同一獎項類別，每個遊戲帳號只能兌換一次。</u>
                            </b>
                          </li>
                          <li style={liStyle}>每個序號僅限一次兌換。</li>
                          <li style={liStyle}>錯誤達十次將鎖定兌獎功能。</li>
                          <li style={liStyle}>
                            獎項將於每週一晚上 23：59
                            前，發送上一週「週一~週日」兌換成功之帳號，將以遊戲內郵件發送獎勵至所填寫的角色ID。
                          </li>
                        </ul>
                      </fieldset>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}{" "}
        </div>{" "}
      </div>
    </div>
  );
};

const liStyle = { listStyleType: "square", marginBottom: "0.5rem" };

const mapStateToProps = state => ({
  event: state.event,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { loadUser, redeemSerial }
)(EventSerial);
