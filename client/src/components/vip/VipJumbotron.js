import React, { Fragment } from "react";
import PropTypes from "prop-types";

const VipJumbotron = ({ game_id, products }) => {
  const slogan =
    game_id === "g66naxx2tw" ? (
      <h5 className="display-5">
        <span role="img" aria-label="fire">
          🔥🔥
        </span>
        千呼萬喚的儲值方案登場了!!
        <span role="img" aria-label="fire">
          🔥🔥
        </span>
      </h5>
    ) : (
      <h5 className="display-5">
        <span role="img" aria-label="magnifier">
          🔎 🔎
        </span>
        各位親愛的偵探們照過來
        <span role="img" aria-label="magnifier">
          🔎 🔎
        </span>
      </h5>
    );

  const banner =
    game_id === "g66naxx2tw" ? (
      <img
        src="/p/image/support_help/g66_wire_report_banner.jpg"
        className="rounded img-fluid m-auto"
        alt="千呼萬喚的儲值方案登場了!!"
      ></img>
    ) : (
      <img
        src="/p/image/support_help/h55_wire_report_banner.png"
        className="rounded img-fluid m-auto"
        alt="各位親愛的偵探們照過來!!"
      ></img>
    );

  const event_alert =
    game_id === "g66naxx2tw" ? (
      <div className="alert alert-primary" role="alert">
        <h5 className="alert-heading"> 限時滿額禮：</h5>
        單筆購買滿NTD 15,000元以上， <br />
        機械材料LV1*20、護甲材料LV1*20、配方殘頁*250、新幣30000
        <br />
        購買滿NTD 30,000元，即贈送兩包滿額禮，以此類推！
        <br />
        滿額禮僅計算<strong>單筆消費</strong>，無法累積計算或合併計算。
      </div>
    ) : null;
  const products_info = (
    <div>
      <h3 className="mt-2">方案如下 ：</h3>
      <ul>
        {products.map((prod) => (
          <li key={`prod_${prod.product_id}`}>
            <span role="img" aria-label="box">
              🔹
            </span>
            NTD.{prod.price}，共可獲得 {prod.gold}{" "}
            {game_id === "g66naxx2tw" ? "信用點" : "回聲"}。
            {game_id === "g66naxx2tw" && prod.price >= 15000 ? (
              <span role="img" aria-label="gift">
                🎁
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      <br />
    </div>
  );

  const special_note =
    game_id === "g66naxx2tw" ? (
      <strong className="text-danger">
        <span role="img" aria-label="loudspeaker">
          📢
        </span>
        電台方案僅適用【台灣龍邑版本】，用戶需使用雙平台商店所下載的台灣龍邑版本。如非使用台灣龍邑版本，請先更換版本後再行匯款填單。
        <br />
        <span role="img" aria-label="loudspeaker">
          📢
        </span>
        若您欲購買未滿3000元的品項，歡迎使用
        <a target="blank" href="https://www.lifeafterpay.com/">
          <img
            width="60"
            alt="MyCard logo"
            src="https://image.mycard520.com/globalmycard/images/mycard_logo.png"
          />
        </a>
        進行儲值喔!
        <br />
      </strong>
    ) : (
      <strong className="text-danger">
        <span role="img" aria-label="loudspeaker">
          📢
        </span>
        僅提供龍邑亞洲服角色購買。
        <br />
      </strong>
    );
  // ? 'NTD.3,000，信用點 6480 贈 1788，共可獲得 8268 信用點。'
  // : '儲值NTD.3,000，共可獲得7200回聲。';
  const contact_nickname1 = game_id === "g66naxx2tw" ? "小夥伴" : "小管家";

  return (
    <Fragment>
      <div className="row">
        <div className="col-lg-3 mt-3"> </div>
        <div className="col-lg-6  col-sm-12  mt-3">{banner}</div>
        <div className="col-lg-3 mt-3"> </div>
      </div>
      <div className="row">
        <div className="col-lg-3 mt-3"> </div>
        <div className="col-lg-6  col-sm-12 mt-3">
          <div className="jumbotron jumbotron-fluid">
            <div className="container">
              {slogan}
              <hr className="my-4" />
              {event_alert}
              {products_info}

              <p className="small">
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
                匯款完畢後，還請您提供下方資訊，填妥後，這邊會請
                {contact_nickname1}儘快確認
                <br />
                <br />
                PS：
                <span className="text-danger">
                  <strong>匯款後</strong>
                </span>
                即無法進行退換貨的服務喔！
                <br />
                <br />
                {special_note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

VipJumbotron.propTypes = { game_id: PropTypes.string.isRequired };

export default VipJumbotron;
