import React, { useState, Fragment } from 'react';
//import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import './survey.css';
const SurveyMain = (props) => {
  const [step, setStep] = useState(0);

  const list = [
    {
      id: 0,
      question: `超愛鋼普拉的你
    覺得怎麼做都不夠精緻？ 
    讓我們密斯特喬 x 圖文不符上課囉 
    來拯救你的鋼普拉吧！！
    
    大家好，我是喬老師 
    我將在 Hahow 好學校開設線上模型課啦！ 
    邀請你花 5 分鐘填寫課程問卷 
    你的回答，我都會全力在課程教給你 
    寫完還能搶先拿到課程 8 折優惠嘿～ `,
      type: 'statement',
    },
    {
      id: 1,
      question: '組裝製作階段中，你最需要學習什麼內容*',
      answers: {
        a: '我要學基礎組裝，用最有效率的方式完成素組',
        b: '我要學進階製作，增加細節，讓作品精緻度爆發',
        c: '小孩才做選擇，大人我全都要！',
      },
      type: 'choose',
    },
    {
      id: 2,
      question: '質感塗裝階段中，你最需要學習什麼內容？',
      answers: {
        a: '我要學筆塗，練好塗裝基本功為鋼彈均勻上色',
        b: '我要學基礎噴漆，調配出心中理想顏色',
        c: '我要學進階噴漆，不受顏色束縛自由展現多變風格',
        d: '小孩才做選擇，大人我全都要！',
      },
      type: 'choose',
    },
  ];

  const currentItem = list.filter((item) => item.id === step)[0];

  return (
    <div className='bg-dark' style={{ height: '100vh' }}>
      <div>
        <div className='header_img container'>
          {false && (
            <img
              src='\p\image\support_help\h55_wire_report_banner.png'
              className=' img-fluid rounded mx-auto  d-block'
            />
          )}
        </div>

        <div className='text-light text-center'>
          <div
            style={{ lineHeight: '36px', whiteSpace: 'pre-line' }}
            className='h5 mt-1 p-3'>
            {currentItem
              ? `#${currentItem.id}. ${currentItem.question}`
              : '感謝您的作答'}
          </div>
          {!currentItem && (
            <div>
              <button
                type='button'
                className='btn btn-danger mx-auto d-block '
                onClick={() => setStep(0)}>
                重新來過
              </button>{' '}
            </div>
          )}

          {currentItem && (
            <div>
              {currentItem.type === 'statement' ? (
                <button
                  type='button'
                  className='btn btn-danger mx-auto d-block '
                  onClick={() => setStep(step + 1)}>
                  OK
                </button>
              ) : (
                Object.keys(currentItem.answers).map((option) => (
                  <Fragment>
                    <div className='row'>
                      <div className='col-sm-3'></div>
                      <div className='col-sm-6 d-block p-1 '>
                        <button
                          type='button'
                          className='btn btn-outline-info  btn-block text-left mt-2 ml-1 mr-1'
                          onClick={() => setStep(step + 1)}>
                          {option} - {currentItem.answers[option]}
                        </button>
                      </div>
                      <div className='col-3'></div>
                    </div>
                  </Fragment>
                ))
              )}
            </div>
          )}
          <div className='row mt-5'>
            <div className='col-md-4'></div>
            <div className='col-md-4'>
              <div className='progress' style={{ height: '10px' }}>
                <div
                  className='progress-bar progress-bar-striped bg-info'
                  role='progressbar'
                  style={{ width: `${(step * 100) / list.length}%` }}
                  aria-valuenow={(step * 100) / list.length}
                  aria-valuemin='0'
                  aria-valuemax='100'>
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

SurveyMain.propTypes = {};

export default SurveyMain;
