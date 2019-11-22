import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import moment from "moment";
import TaiwanAddressPick from "../common/TaiwanAddressPick";
import { getServers } from "../../actions/gameActions";
import { createVipOrder } from "../../actions/vipActions";
import VipResult from "./VipResult";
import PropTypes from "prop-types";

const VipHome = ({
  errors = {},
  game = {},
  getServers,
  createVipOrder,
  record
}) => {
  const [serverId, setServerId] = useState("");
  const [email, setEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [wireCode, setWireCode] = useState("");

  const [wireTime, setWireTime] = useState("");
  const [wireAmount, setWireAmount] = useState("");
  const [wireName, setWireName] = useState("");
  const [bankName, setBankName] = useState("");
  const [charName, setCharName] = useState("");
  const [roleId, setRoleId] = useState("");

  const [note, setNote] = useState("");

  const [invoiceOption, setInvoiceOption] = useState("donate");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("1");

  const gameId = "g66naxx2tw";

  const [serversOption, setServersOption] = useState([]);

  const productsOption = [
    {
      label: "台幣3000方案 - 信用點 6480 贈 1788，共可獲得 8268 信用點",
      value: "75084"
    }
  ];

  useEffect(() => {
    getServers(gameId);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (game.servers) {
      const servers = game.servers
        .filter(server => server.server_status === "public")
        .map(server => ({
          label: server.server_name,
          value: server.server_id
        }));
      setServersOption([
        {
          label: "選擇伺服器",
          value: ""
        },
        ...servers
      ]);
    }
  }, [game]);

  const vipFormSubmit = e => {
    e.preventDefault();
    const vipOrders = {
      email,
      userPhone,
      wireCode,
      wireTime: moment(wireTime).format("YYYY-MM-DD HH:mm:ss"),
      wireAmount,
      wireName,
      bankName,
      charName,
      roleId,
      gameId,
      serverId,
      note,
      invoiceOption,
      area,
      address,
      productId,
      qty
    };

    createVipOrder(vipOrders);
  };

  if (record.report_id) {
    return <VipResult record={record} />;
  }

  const invoiceOptionClick = invoiceType => {
    //console.log("invoiceOptionClick", invoiceType);
    setInvoiceOption(invoiceType);
  };

  const onAddressChange = value => {
    setArea(value);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3 mt-3"> </div>
        <div className="col-lg-6  col-sm-12  mt-3">
          <img
            src="https://lh3.googleusercontent.com/fWnsvnNSoQCvdHryUuEWpKhYThClG0ERsDEBr_cFYtkw_mSuZknZ1ruVoPCzBF_pElbi5uAh6QcprVDEClXjpkDDk3r0JpBhCqE1MZ7L-dHqhauzs0K8TsIdbh5n=w640"
            className="rounded img-fluid m-auto"
            alt="千呼萬喚的儲值方案登場了!!"
          ></img>
        </div>
        <div className="col-lg-3 mt-3"> </div>
      </div>
      <div className="row">
        <div className="col-lg-3 mt-3"> </div>
        <div className="col-lg-6  col-sm-12 mt-3">
          <div className="jumbotron jumbotron-fluid">
            <div className="container">
              <h5 className="display-5">
                <span role="img" aria-label="fire">
                  🔥🔥
                </span>
                千呼萬喚的儲值方案登場了!!
                <span role="img" aria-label="fire">
                  🔥🔥
                </span>
              </h5>
              <hr className="my-4" />
              <p>
                試營運方案： <br />
                <span role="img" aria-label="hand">
                  👉
                </span>
                NTD.3,000，信用點 6480 贈 1788， 共可獲得 8268 信用點。
              </p>
              <p className="small">
                目前儲值系統還在試營運當中，未來還會再做調整！
                <br />
                若您有購買意願的話，可直接以轉帳、匯款方式進行．
              </p>
              <p className="text-center">
                <span role="img" aria-label="sparkling stars">
                  ✨ ✨ ✨ ✨ 匯款資料 ✨ ✨ ✨ ✨
                </span>
                <br />
                第一銀行(007) <br />
                大坪林分行
                <br />
                帳號：222-10-038756
                <br />
                戶名：龍邑股份有限公司
                <br />
                <span role="img" aria-label="sparkling stars">
                  ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨
                </span>
              </p>
              <br />
              <br />
              <p className="small">
                匯款完畢後，還請您提供下方資訊，填妥後，這邊會請小夥伴儘快確認
                <br />
                <br />
                PS：完成交易後即無法進行退換貨的服務喔！
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 mt-3"> </div>
        <div className="col-lg-6 col-sm-12 mt-3">
          <form className="card border-info mb-3" onSubmit={vipFormSubmit}>
            <div className="card-body text-info">
              {errors.msg && (
                <div className="alert alert-danger" role="alert">
                  {errors.msg}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="userPhone" className="col-form-label-sm">
                  聯絡電話
                </label>
                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      role="img"
                      aria-label="mobile"
                    >
                      📱
                    </span>
                  </div>
                  <input
                    type="tel"
                    id="userPhone"
                    aria-describedby="phoneHelp"
                    placeholder="請輸入您的手機號碼"
                    value={userPhone}
                    onChange={e => setUserPhone(e.target.value)}
                    className={classnames("form-control form-control-md", {
                      "is-invalid": errors.userPhone
                    })}
                  />
                  {errors.userPhone && (
                    <div className="invalid-feedback">{errors.userPhone}</div>
                  )}
                </div>

                <small id="phoneHelp" className="form-text text-muted">
                  僅供訂單有異常時聯繫用
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="col-form-label-sm">
                  Email
                </label>
                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text "
                      role="img"
                      aria-label="email"
                    >
                      📧
                    </span>
                  </div>
                  <input
                    type="email"
                    className={classnames("form-control form-control-md", {
                      "is-invalid": errors.email
                    })}
                    id="email"
                    aria-describedby="emailHelp"
                    placeholder="輸入您的電子郵件"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <small id="phoneHelp" className="form-text text-muted">
                  僅供訂單有異常時聯繫用
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="productId" className="col-form-label-sm">
                  方案
                </label>
                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      role="img"
                      aria-label="gift"
                    >
                      🎁
                    </span>
                  </div>
                  <select
                    className={classnames("form-control form-control-md", {
                      "is-invalid": errors.productId
                    })}
                    name={productId}
                    value={productId}
                    onChange={e => setProductId(e.target.value)}
                  >
                    <option value="">選擇方案</option>
                    {productsOption.map(option => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.productId && (
                    <div className="invalid-feedback">{errors.productId}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="qty" className="col-form-label-sm">
                  數量
                </label>
                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      role="img"
                      aria-label="number"
                    >
                      #️⃣
                    </span>
                  </div>
                  <input
                    type="number"
                    className={classnames("form-control form-control-md", {
                      "is-invalid": errors.qty
                    })}
                    id="qty"
                    placeholder="輸入數量"
                    min="1"
                    max="10"
                    value={qty}
                    onChange={e => setQty(e.target.value)}
                  />
                  {errors.qty && (
                    <div className="invalid-feedback">{errors.qty}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="wireCode" className="col-form-label-sm">
                  匯款帳號後五碼
                </label>

                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      role="img"
                      aria-label="receipt"
                    >
                      🧾
                    </span>
                  </div>
                  <input
                    type="text"
                    className={classnames("form-control form-control-md", {
                      "is-invalid": errors.wireCode
                    })}
                    id="wireCode"
                    placeholder="輸入您匯款使用帳號的後五碼"
                    value={wireCode}
                    onChange={e => setWireCode(e.target.value)}
                    maxLength="10"
                  />
                  {errors.wireCode && (
                    <div className="invalid-feedback">{errors.wireCode}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="wireTime" className="col-form-label-sm">
                  匯款時間{" "}
                </label>
                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      role="img"
                      aria-label="clock"
                    >
                      🕙
                    </span>
                  </div>
                  <input
                    type="datetime-local"
                    className={classnames("form-control form-control-md", {
                      "is-invalid": errors.wireTime
                    })}
                    id="wireTime"
                    value={moment(wireTime).format("YYYY-MM-DDTHH:mm")}
                    //onChange={e => setWireTime(e.target.value)}
                    onChange="alert(event.target.value)"
                  />
                  {errors.wireTime && (
                    <div className="invalid-feedback">{errors.wireTime}</div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="wireAmount" className="col-form-label-sm">
                  匯款金額
                </label>
                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      role="img"
                      aria-label="money sign"
                    >
                      💲
                    </span>
                  </div>
                  <input
                    type="number"
                    className={classnames("form-control form-control-md", {
                      "is-invalid": errors.wireAmount
                    })}
                    id="wireAmount"
                    placeholder="輸入匯款金額"
                    min="3000"
                    value={wireAmount}
                    onChange={e => setWireAmount(e.target.value)}
                  />
                  {errors.wireAmount && (
                    <div className="invalid-feedback">{errors.wireAmount}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="wireName" className="col-form-label-sm">
                  匯款戶名
                </label>

                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      role="img"
                      aria-label="user"
                    >
                      👤
                    </span>
                  </div>
                  <input
                    type="text"
                    className={classnames("form-control form-control-md", {
                      "is-invalid": errors.wireName
                    })}
                    id="wireName"
                    placeholder="輸入匯款帳戶名稱"
                    value={wireName}
                    onChange={e => setWireName(e.target.value)}
                    maxLength="10"
                  />
                  {errors.wireName && (
                    <div className="invalid-feedback">{errors.wireName}</div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="bankName" className="col-form-label-sm">
                  銀行名稱
                </label>

                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      role="img"
                      aria-label="bank"
                    >
                      🏦
                    </span>
                  </div>
                  <input
                    type="text"
                    className={classnames("form-control form-control-md", {
                      "is-invalid": errors.bankName
                    })}
                    id="bankName"
                    placeholder="輸入銀行名稱"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    maxLength="20"
                  />
                  {errors.bankName && (
                    <div className="invalid-feedback">{errors.bankName}</div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="charName" className="col-form-label-sm">
                  角色名稱
                </label>

                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      role="img"
                      aria-label="superhero"
                    >
                      🦸
                    </span>
                  </div>
                  <input
                    type="text"
                    className={classnames("form-control form-control-md", {
                      "is-invalid": errors.charName
                    })}
                    id="charName"
                    placeholder="輸入角色名稱"
                    value={charName}
                    onChange={e => setCharName(e.target.value)}
                    maxLength="20"
                  />
                  {errors.charName && (
                    <div className="invalid-feedback">{errors.charName}</div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="roleId" className="col-form-label-sm">
                  人物帳號ID (右上方設定點擊進去看到) *
                </label>

                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      role="img"
                      aria-label="number text"
                    >
                      🔢
                    </span>
                  </div>
                  <input
                    type="text"
                    className={classnames("form-control form-control-md", {
                      "is-invalid": errors.roleId
                    })}
                    id="roleId"
                    placeholder="人物帳號ID "
                    value={roleId}
                    onChange={e => setRoleId(e.target.value)}
                    maxLength="20"
                  />
                  {errors.roleId && (
                    <div className="invalid-feedback">{errors.roleId}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="serverId" className="col-form-label-sm">
                  伺服器
                </label>
                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      role="img"
                      aria-label="pc"
                    >
                      🖥
                    </span>
                  </div>
                  <select
                    className={classnames("form-control form-control-md", {
                      "is-invalid": errors.serverId
                    })}
                    name={serverId}
                    value={serverId}
                    onChange={e => setServerId(e.target.value)}
                  >
                    {serversOption.map(option => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.serverId && (
                    <div className="invalid-feedback">{errors.serverId}</div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="note" className="col-form-label-sm">
                  備註
                </label>

                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      role="img"
                      aria-label="comment"
                    >
                      💬
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="note"
                    placeholder="有需要註記給瑞秋的都可以填上 "
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="invoice" className="col-form-label-sm">
                  發票選項
                </label>

                <div className="form-group">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="invoiceOption"
                      id="invoiceDonate"
                      value="donate"
                      checked={invoiceOption === "donate"}
                      onChange={e => invoiceOptionClick(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="invoiceDonate">
                      捐贈臺灣環境資訊協會 (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://teia.tw/zh-hant/donate/credit"
                      >
                        發票徵信
                      </a>
                      )
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="invoiceOption"
                      id="invoicePaper"
                      value="paper"
                      checked={invoiceOption === "paper"}
                      onChange={e => invoiceOptionClick(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="invoicePaper">
                      紙本發票
                    </label>
                    {invoiceOption === "paper" && (
                      <Fragment>
                        <TaiwanAddressPick onChange={onAddressChange} />
                        <input
                          className="form-control"
                          type="text"
                          placeholder="發票寄送地址"
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                        />
                      </Fragment>
                    )}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                送出
              </button>
            </div>
          </form>
        </div>
        <div className="col-lg-3 mt-3"> </div>
      </div>
    </div>
  );
};

VipHome.propTypes = {
  getServers: PropTypes.func.isRequired,
  createVipOrder: PropTypes.func.isRequired,
  errors: PropTypes.object
};
const mapStateToProps = state => ({
  errors: state.errors,
  game: state.games.game,
  record: state.vip.record
});
export default connect(mapStateToProps, { getServers, createVipOrder })(
  VipHome
);
