import React, { useState, Fragment } from "react";
//import { CSSTransition } from 'react-transition-group';

import "./survey.css";
const SurveyMain = (props) => {
  const [step, setStep] = useState(0);

  const list = [
    {
      id: 0,
      question: `親愛的專屬會員您好！歡迎您參加本次問卷調查活動！
      擁有專屬資格的會員在完成問卷且驗證有效後，將會透過EMAIL發送90點MYCARD點數卡給您！
      還請會員們填寫真實建議，再次感謝您的寶貴意見與支持😊
      ※每個資格會員，限領乙組點數卡。
       `,
      type: "statement",
    },
    {
      id: 1,
      question:
        "請填寫您在明日之後－瑞秋電台或第五人格－莊園小管家，用於初次登記”專屬服務”資格的遊戲內ID，以及您的用戶中心帳號ID。*",
      answers: {
        a: "帳號id",
        b: "角色id",
      },
      type: "input",
    },
    {
      id: 1,
      question: "組裝製作階段中，你最需要學習什麼內容*",
      answers: {
        a: "我要學基礎組裝，用最有效率的方式完成素組",
        b: "我要學進階製作，增加細節，讓作品精緻度爆發",
        c: "小孩才做選擇，大人我全都要！",
      },
      type: "choose",
    },
    {
      id: 2,
      question: "質感塗裝階段中，你最需要學習什麼內容？",
      answers: {
        a: "我要學筆塗，練好塗裝基本功為鋼彈均勻上色",
        b: "我要學基礎噴漆，調配出心中理想顏色",
        c: "我要學進階噴漆，不受顏色束縛自由展現多變風格",
        d: "小孩才做選擇，大人我全都要！",
      },
      type: "choose",
    },
  ];

  const currentItem = list.filter((item) => item.id === step)[0];

  return (
    <div className="bg-dark" style={{ height: "100vh" }}>
      <div>
        <div className="header_img container">
          {false && (
            <img
              src="\p\image\support_help\h55_wire_report_banner.png"
              className=" img-fluid rounded mx-auto  d-block"
              alt="demo pic"
            />
          )}
        </div>

        <div className="text-light">
          <div
            style={{ lineHeight: "32px", whiteSpace: "pre-line" }}
            className="h6 mt-1 p-3"
          >
            {currentItem
              ? `#${currentItem.id}. ${currentItem.question}`
              : "感謝您的作答"}
          </div>
          {!currentItem && (
            <div>
              <button
                type="button"
                className="btn btn-danger mx-auto d-block "
                onClick={() => setStep(0)}
              >
                重新來過
              </button>{" "}
            </div>
          )}

          {currentItem && (
            <div>
              {currentItem.type === "statement" ? (
                <button
                  type="button"
                  className="btn btn-danger mx-auto d-block "
                  onClick={() => setStep(step + 1)}
                >
                  OK
                </button>
              ) : (
                Object.keys(currentItem.answers).map((option) => (
                  <Fragment>
                    <div className="row">
                      <div className="col-sm-3"></div>
                      <div className="col-sm-6 d-block p-1 ">
                        <button
                          type="button"
                          className="btn btn-outline-info  btn-block text-left mt-2 ml-1 mr-1"
                          onClick={() => setStep(step + 1)}
                        >
                          {option} - {currentItem.answers[option]}
                        </button>
                      </div>
                      <div className="col-3"></div>
                    </div>
                  </Fragment>
                ))
              )}
            </div>
          )}
          <div className="row mt-5">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <div className="progress" style={{ height: "10px" }}>
                <div
                  className="progress-bar progress-bar-striped bg-info"
                  role="progressbar"
                  style={{ width: `${(step * 100) / list.length}%` }}
                  aria-valuenow={(step * 100) / list.length}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {Number.parseInt((step * 100) / list.length)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyMain;
