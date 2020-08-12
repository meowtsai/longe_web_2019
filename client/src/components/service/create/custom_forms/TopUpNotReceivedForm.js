import React from "react";
import classnames from "classnames";

const TopUpNotReceivedForm = ({ register, errors }) => {
  return (
    <div>
      <div className="form-group">
        <label className="small text-primary" htmlFor="account">
          帳號ID
        </label>
        <input
          type="number"
          className={classnames("form-control form-control-md", {
            "is-invalid": errors.account,
          })}
          name="account"
          ref={register({ required: true })}
        />
        <small id="accountHelp" className="form-text text-muted">
          用戶中心的數字ID
        </small>
      </div>
      <div className="form-group">
        <label className="small text-primary" htmlFor="roleIdInput">
          角色ID
        </label>
        <input
          type="number"
          name="roleId"
          className={classnames("form-control form-control-md", {
            "is-invalid": errors.roleId,
          })}
          ref={register({ required: true })}
        />
        <small id="roleIdHelp" className="form-text text-muted">
          遊戲內個人檔案的數字
        </small>
      </div>
      <div className="form-group">
        <label className="small text-primary">
          交易時間{" "}
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            data-toggle="modal"
            data-target="#helpModal"
          >
            <span role="img" aria-label="help">
              {" "}
              💡
            </span>
          </button>
        </label>
        <input
          type="text"
          className={classnames("form-control form-control-md", {
            "is-invalid": errors.trxTime,
          })}
          name="trxTime"
          ref={register({ required: true })}
        />
        <small id="trxTimeHelp" className="form-text text-muted">
          訂單完成的時間
        </small>
      </div>
      <div className="form-group">
        <label className="small text-primary">
          訂單編號{" "}
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            data-toggle="modal"
            data-target="#helpModal"
          >
            <span role="img" aria-label="help">
              {" "}
              💡
            </span>
          </button>
        </label>
        <input
          type="text"
          className={classnames("form-control form-control-md", {
            "is-invalid": errors.trxId,
          })}
          name="trxId"
          ref={register({ required: true })}
        />
      </div>
      <div className="form-group">
        <label className="small text-primary">購買品項名稱</label>
        <input
          type="text"
          className={classnames("form-control form-control-md", {
            "is-invalid": errors.productName,
          })}
          name="productName"
          ref={register({ required: true })}
        />
      </div>
      <div className="form-group">
        <label className="small text-primary">未收到的商品名稱</label>
        <input
          type="text"
          className={classnames("form-control form-control-md", {
            "is-invalid": errors.productNotReceived,
          })}
          name="productNotReceived"
          ref={register({ required: true })}
        />
      </div>
      <div className="form-group">
        <label className="small text-primary">
          收據圖檔{" "}
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            data-toggle="modal"
            data-target="#helpModal"
          >
            <span role="img" aria-label="help">
              {" "}
              💡
            </span>
          </button>
        </label>
        <input
          type="file"
          className={classnames("form-control-file", {
            "is-invalid": errors.receiptFile,
          })}
          name="receiptFile"
          ref={register({ required: true })}
          accept="image/gif, image/jpeg,image/png"
        />
        {errors.receiptFile && (
          <div className="invalid-feedback">請務必提供收據圖檔</div>
        )}
      </div>
      <div className="form-group">
        <label className="small text-primary">
          包含付款時分秒的簡訊或收據截圖{" "}
        </label>
        <input
          type="file"
          className={classnames("form-control-file", {
            "is-invalid": errors.smsFile,
          })}
          name="smsFile"
          ref={register({ required: true })}
          accept="image/gif, image/jpeg,image/png"
        />
        {errors.receiptFile && (
          <div className="invalid-feedback">請務必提供簡訊或收據截圖</div>
        )}
      </div>

      <div
        className="modal fade"
        id="helpModal"
        role="dialog"
        aria-labelledby="helpModalTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="helpModalTitle">
                儲值後未收到商品須檢附資料說明
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <h6 className="text-dark">
                購買記錄查詢以及雙平台儲值訂單查詢教學
              </h6>
              請依照您的設備來查詢【購買記錄】並上傳截圖。 <br />
              <div className="text-info">《IOS 消費及收據查詢》</div>
              <ol style={{ paddingLeft: "25px" }}>
                <li style={{ listStyleType: "decimal" }}>
                  使用行動裝置，前往「設定」> [「iTunes 與App Store」。
                  點一下Apple ID，選擇「檢視Apple ID」。
                  系統可能會要求您使用Apple ID 登入。 ...
                  選擇「購買記錄」，即可查看收據。
                </li>
                <li style={{ listStyleType: "decimal" }}>
                  使用ITUNES，點選「帳戶」> 檢視我的帳戶 >
                  選擇購買記錄的「顯示全部」。
                </li>
                <li style={{ listStyleType: "decimal" }}>
                  前往ITUNES帳號註冊之電子信箱，找到APPLE寄送的訂單收據。
                </li>
              </ol>
              <div className="text-info">《Android 消費記錄查詢》</div>
              <ol style={{ paddingLeft: "25px" }}>
                <li style={{ listStyleType: "decimal" }}>
                  在行動裝置上開啟 Google Play 商店應用程式 Google
                  Play，依序輕觸「選單」圖示 選單 下一步 [帳戶]。 選擇
                  [購買記錄]。
                </li>
                <li style={{ listStyleType: "decimal" }}>
                  使用 play.google.com，前往您的 Google Play 帳戶 >
                  選擇「訂單記錄」。
                </li>
              </ol>
              <div className="text-info">《Android 收據查詢》</div>
              <ul style={{ paddingLeft: "25px" }}>
                <li style={{ listStyleType: "circle" }}>
                  {" "}
                  前往Google Play 帳戶電子信箱，找到Google Play 寄送的訂單收據。
                </li>
              </ul>
              <div className="text-info">《收據截圖範例》</div>
              <span className="text-danger">
                ※請注意，提供收據截圖時，請提供顯示包含訂單編號的完整截圖。
              </span>
              <figure className="figure">
                <img
                  src="/p/image/support_help/ios_receipt_example.png"
                  className="figure-img img-fluid rounded"
                  alt="App Store 寄送的訂單收據"
                />

                <figcaption className="figure-caption">
                  iPhone 設備玩家請提供 App Store 寄送的訂單收據
                </figcaption>
              </figure>
              <figure className="figure">
                <img
                  src="/p/image/support_help/android_receipt_example.png"
                  className="figure-img img-fluid rounded"
                  alt="Google Play 寄送的訂單收據"
                />

                <figcaption className="figure-caption">
                  Android 設備玩家請提供 Google Play 寄送的訂單收據
                </figcaption>
              </figure>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                關閉說明
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpNotReceivedForm;
