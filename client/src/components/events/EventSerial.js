import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import queryString from "query-string";
import Spinner from "../common/Spinner";
import { loadUser, redeemSerial } from "../../actions/eventActions";
import TextFieldGroup from "../common/TextFieldGroup";
import RedeemRecords from "./RedeemRecords";
import EventNote from "./EventNote";
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
    // eslint-disable-next-line
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
                      <EventNote event={event} />
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

const mapStateToProps = state => ({
  event: state.event,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { loadUser, redeemSerial }
)(EventSerial);
