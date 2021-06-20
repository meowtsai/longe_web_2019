import React, { useEffect, useState } from "react";
import Navbar from "../games/Navbar";
import { getGames } from "../../actions/gameActions";
import { connect } from "react-redux";
const HelpScreen = ({ getGames, games }) => {
  const [display, setDisplay] = useState({
    headingOne: false,
    headingTwo: false,
  });

  useEffect(() => {
    getGames();
    document.title = "龍邑遊戲|FAQ";
  }, []);
  return (
    <>
      <Navbar games={games} />

      <div className="container mt-3">
        <div className="row">
          <div className="col-lg-3 mt-3"> </div>
          <div className="col-lg-6 col-sm-12 mt-3">
            <div className="pt-2">
              <h4 className="accordion-header d-block" id="headingOne">
                <button
                  className="accordion-button d-block"
                  type="button"
                  onClick={() =>
                    setDisplay({ headingOne: !display.headingOne })
                  }
                >
                  <i className="fab fa-android text-success"></i> Google
                  訂單收據的查詢方法
                </button>
              </h4>

              <hr className="my-4" />
              {display.headingOne && (
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    {" "}
                    1. 請先至您的gmail信箱內查看收據(信件主旨為"Google Play
                    訂單收據")
                  </li>
                  <li className="list-group-item">
                    {" "}
                    2. 若找不到Google Play購買信件，必須前往Google
                    付款中心查詢：
                    <ul className="list-group">
                      <li className="list-group-item">
                        a. 前往{" "}
                        <a href="https://pay.google.com/"> pay.google.com</a>。
                      </li>
                      <li className="list-group-item">
                        b. 找出 <strong>[其他消費活動]</strong>。
                      </li>
                      <li className="list-group-item">
                        c. 選取 <strong>[查看消費內容]</strong>。
                      </li>
                      <li className="list-group-item">
                        d. 選取您要查看收據的訂單。
                      </li>
                      <li className="list-group-item">
                        e. 將以下格式的截圖付給我們, 請注意:
                        <div className="mt-1"> ✔️一定要有GPA訂單編碼</div>
                        <div className="mt-1">✔️一定要有商品名稱價格</div>
                        <div className="mt-1">✔️一定要有訂單日期</div>
                        <img
                          src="/guide/googleplay_image.png"
                          className="mt-1"
                          alt=""
                        />
                      </li>
                    </ul>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3 mt-3"> </div>
          <div className="col-lg-6 col-sm-12 mt-3">
            <div className="pt-2">
              <h4 class="accordion-header" id="headingTwo">
                <button
                  className="accordion-button"
                  type="button"
                  onClick={() =>
                    setDisplay({ headingTwo: !display.headingTwo })
                  }
                >
                  <i className="fab fa-apple text-secondary"></i> App Store
                  訂單收據的查詢方法
                </button>
              </h4>
              <hr className="my-4" />
              {display.headingTwo && (
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    {" "}
                    1. 請先至Apple id信箱內查看交易明細是否有保存
                  </li>
                  <li className="list-group-item">
                    {" "}
                    2. 也可參考官方教學: <br />{" "}
                    <a
                      href="https://support.apple.com/zh-tw/HT204088"
                      target="_blank"
                    >
                      查看在 App Store 或 iTunes Store 中的購買紀錄
                    </a>
                  </li>

                  <li className="list-group-item">
                    {" "}
                    3. 透過裝置【在 iPhone、iPad 或 iPod touch
                    上】自行查詢步驟如下
                    <ul className="list-group">
                      <li className="list-group-item">
                        a. 前往手機/平板的【設定】> 【您的名稱】 >【iTunes 與
                        App Store】。
                      </li>
                      <li className="list-group-item">
                        b. 點一下您的 Apple ID，然後點一下「檢視 Apple
                        ID」。系統可能會要求您認證 Apple ID。
                      </li>
                      <li className="list-group-item">
                        c. 捲動至「購買記錄」並點擊。
                      </li>
                      <li className="list-group-item">
                        d.
                        點擊您此筆未取得的商品資料，即會進入此筆交易的詳細資料
                      </li>
                      <li className="list-group-item">
                        e. 再次點擊您欲查詢之訂單，則會顯示您確切的購買日期,
                        請提供訂單詳細截圖, 格式說明如下
                        <figure className="figure mt-1">
                          <img
                            src="/guide/appstore_image1.png"
                            className="figure-img img-fluid rounded  mt-1"
                            alt="一筆訂單可能會有多次購買記錄，若要查看確實購買日期，還需要繼續點擊下方金額。"
                          />
                          <figcaption className="figure-caption">
                            一筆訂單可能會有多次購買記錄，
                            若要查看確實購買日期，還需要
                            <strong>繼續點擊下方金額。</strong>
                          </figcaption>
                        </figure>
                        <figure className="figure  mt-1">
                          <img
                            src="/guide/appstore_image2.png"
                            className="figure-img img-fluid rounded"
                            alt="這個畫面就是單獨一次消費的交易明細→
                            ※需要點擊到此頁面獲得「購買日期」才算完整。"
                          />
                          <figcaption className="figure-caption">
                            這個畫面就是單獨一次消費的交易明細 ↑ <br />
                            <strong>
                              ※需要點擊到此頁面獲得「購買日期」才算完整。
                            </strong>
                          </figcaption>
                        </figure>
                      </li>
                    </ul>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  games: state.games.games,
});
export default connect(mapStateToProps, { getGames })(HelpScreen);
