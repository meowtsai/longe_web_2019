import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const VipJumbotron = ({ game_id }) => {
  const slogan =
    game_id === 'g66naxx2tw' ? (
      <h5 className='display-5'>
        <span role='img' aria-label='fire'>
          🔥🔥
        </span>
        千呼萬喚的儲值方案登場了!!
        <span role='img' aria-label='fire'>
          🔥🔥
        </span>
      </h5>
    ) : (
      <h5 className='display-5'>
        <span role='img' aria-label='magnifier'>
          🔎 🔎
        </span>
        各位親愛的偵探們照過來
        <span role='img' aria-label='magnifier'>
          🔎 🔎
        </span>
      </h5>
    );

  const banner =
    game_id === 'g66naxx2tw' ? (
      <img
        src='https://lh3.googleusercontent.com/fWnsvnNSoQCvdHryUuEWpKhYThClG0ERsDEBr_cFYtkw_mSuZknZ1ruVoPCzBF_pElbi5uAh6QcprVDEClXjpkDDk3r0JpBhCqE1MZ7L-dHqhauzs0K8TsIdbh5n=w640'
        className='rounded img-fluid m-auto'
        alt='千呼萬喚的儲值方案登場了!!'></img>
    ) : (
      <img
        src='/p/image/support_help/h55_wire_report_banner.png'
        className='rounded img-fluid m-auto'
        alt='各位親愛的偵探們照過來!!'></img>
    );
  const products_info =
    game_id === 'g66naxx2tw' ? (
      <div>
        <h3>
          試營運方案
          <span className='text-danger'>
            <strong>（5/1 00:00 方案截止）</strong>
          </span>
          ：
        </h3>
        <span role='img' aria-label='hand'>
          👉
        </span>
        NTD.3,000，共可獲得 8268 信用點。
        <br />
        <h3 className='mt-2'>
          正式營運方案
          <span className='text-danger'>
            <strong>（5/1 00:00 方案開始）</strong>
          </span>
          ：
        </h3>
        <ul>
          <li>
            <span role='img' aria-label='hand'>
              🎊
            </span>
            NTD.9,000，共可獲得 24804 信用點。
          </li>
          <li>
            <span role='img' aria-label='hand'>
              🎊
            </span>
            NTD.12,000，共可獲得 33072 信用點。
          </li>
          <li>
            <span role='img' aria-label='hand'>
              🎊
            </span>
            NTD.15,000，共可獲得 41340 信用點。
          </li>
          <li>
            <span role='img' aria-label='hand'>
              🎊
            </span>
            NTD.18,000，共可獲得 49608 信用點。
          </li>
          <li>
            <span role='img' aria-label='hand'>
              🎊
            </span>
            NTD.30,000，共可獲得 82680 信用點。
          </li>
        </ul>
        <br />
      </div>
    ) : (
      <p>
        試營運方案： <br />
        <span role='img' aria-label='hand'>
          👉
        </span>
        儲值NTD.3,000，共可獲得7200回聲。
      </p>
    );
  // ? 'NTD.3,000，信用點 6480 贈 1788，共可獲得 8268 信用點。'
  // : '儲值NTD.3,000，共可獲得7200回聲。';
  const contact_nickname1 = game_id === 'g66naxx2tw' ? '小夥伴' : '小管家';
  const contact_nickname2 = game_id === 'g66naxx2tw' ? '瑞秋' : '莊園小管家';
  return (
    <Fragment>
      <div className='row'>
        <div className='col-lg-3 mt-3'> </div>
        <div className='col-lg-6  col-sm-12  mt-3'>{banner}</div>
        <div className='col-lg-3 mt-3'> </div>
      </div>
      <div className='row'>
        <div className='col-lg-3 mt-3'> </div>
        <div className='col-lg-6  col-sm-12 mt-3'>
          <div className='jumbotron jumbotron-fluid'>
            <div className='container'>
              {slogan}
              <hr className='my-4' />
              {products_info}

              <p className='small'>
                若您有購買意願的話，可直接以轉帳、匯款方式進行．
              </p>
              <p className='text-center'>
                <span role='img' aria-label='sparkling stars'>
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
                <span role='img' aria-label='sparkling stars'>
                  ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨
                </span>
              </p>
              <br />
              <br />
              <p className='small'>
                匯款完畢後，還請您提供下方資訊，填妥後，這邊會請
                {contact_nickname1}儘快確認
                <br />
                <br />
                PS：
                <span className='text-danger'>
                  <strong>匯款後</strong>
                </span>
                即無法進行退換貨的服務喔！
                <br />
                <span className='text-danger'>
                  PPS：請務必加入LINE群 並連繫{contact_nickname2}
                  <br />
                  ※若未加入LINE群，並留下角色暱稱，將無法處理訂單※
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

VipJumbotron.propTypes = {};

export default VipJumbotron;
