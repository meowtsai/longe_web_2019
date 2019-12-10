import React from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

const VipResult = ({ record }) => {
  // const record = {
  //   bank_name: "華南銀行",
  //   char_name: "咪捲",
  //   country: "NULL",
  //   email: "shihfan.tsai@gmail.com",
  //   game_id: "g66naxx2tw",
  //   game_name: "明日之後",
  //   ip: "127.0.0.1",
  //   order_id: "VP20191115180233snq",
  //   phone: "0926568279",
  //   role_id: "123456",
  //   server_id: "g66_530007",
  //   server_name: "微星山莊",
  //   wire_amount: "3000",
  //   wire_code: "00123",
  //   wire_name: "小米米",'
  //   wire_time: "00:01"
  // };
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3 mt-3"> </div>
        <div className="col-lg-6 mt-3">
          <div className="card border-success mb-3">
            <div className="card-header bg-success text-light">填寫完成</div>
            <div className="card-body text-success">
              <h5 className="card-title">
                謝謝您，已經收到您的匯款回報．也請連繫瑞秋，加速我們後續處理!
              </h5>
              您的回報內容如下:
              <p className="card-text">
                <table className="table table-hover">
                  <tbody>
                    <tr>
                      <th scope="row">回填單編號</th>
                      <td>{record.report_id}</td>
                    </tr>
                    <tr>
                      <th scope="row">Email</th>
                      <td>{record.email}</td>
                    </tr>
                    <tr>
                      <th scope="row">手機</th>
                      <td>{record.phone}</td>
                    </tr>
                    <tr>
                      <th scope="row">匯款帳號後五碼</th>
                      <td>{record.wire_code}</td>
                    </tr>
                    <tr>
                      <th scope="row">匯款時間</th>
                      <td>
                        <Moment format="YYYY/MM/DD HH:mm">
                          {record.wire_time}
                        </Moment>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">匯款金額</th>
                      <td>
                        {new Intl.NumberFormat("zh-TW", {
                          style: "currency",
                          currency: "TWD"
                        }).format(record.wire_amount)}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">匯款帳戶名</th>
                      <td>{record.wire_name}</td>
                    </tr>
                    <tr>
                      <th scope="row">匯款銀行</th>
                      <td>{record.bank_name}</td>
                    </tr>
                    <tr>
                      <th scope="row" colSpan="2">
                        <hr />
                      </th>
                    </tr>
                    <tr>
                      <th scope="row">遊戲</th>
                      <td>{record.game_name}</td>
                    </tr>
                    <tr>
                      <th scope="row">伺服器</th>
                      <td>{record.server_name}</td>
                    </tr>
                    <tr>
                      <th scope="row">角色ID</th>
                      <td>{record.role_id}</td>
                    </tr>
                    <tr>
                      <th scope="row">角色名稱</th>
                      <td>{record.char_name}</td>
                    </tr>

                    <tr>
                      <th scope="row">發票選項</th>
                      <td>{record.invoice_option}</td>
                    </tr>
                    <tr>
                      <th scope="row">地址</th>
                      <td>{record.address}</td>
                    </tr>
                    <tr>
                      <th scope="row">購買方案</th>
                      <td>{record.title}</td>
                    </tr>
                    <tr>
                      <th scope="row">方案數量</th>
                      <td>{record.qty}</td>
                    </tr>
                  </tbody>
                </table>
              </p>
            </div>
            <div className="card-footer text-center">
              <small className="text-muted">
                / 服務時間：AM 09:00 ~ PM 17:00 /
                <br /> 我們將於服務時間內盡快處理並回報訂單進度．
              </small>
            </div>
          </div>
        </div>
        <div className="col-lg-3 mt-3"> </div>
      </div>
    </div>
  );
};

VipResult.propTypes = {
  record: PropTypes.object.isRequired
};

export default VipResult;
