import React from 'react';
import PropTypes from 'prop-types';
import RedeemRecords from './RedeemRecords';

const EventDeliverooSuccess = ({ msg, logs, resetPage }) => {
  return (
    <div className='alert alert-success'>
      <h4 class='alert-heading'>兌換成功</h4>
      <p>
        我們已經收到您的虛寶兌換申請， 獎項將於 2020/3/31 晚上 23：59
        前，以遊戲內郵件發送至您所填寫的角色ID。
        另外也由系統自動發送了一封mail到您填寫的信箱供您留存參考．
      </p>
      <hr />

      <RedeemRecords logs={logs} />

      <div className='text-center mt-3'>
        <a
          href='https://game.longeplay.com.tw/'
          className='btn btn-secondary  col-5'>
          <i class='fas fa-arrow-circle-left  mr-2' />
          前往官網
        </a>
        <button onClick={resetPage} className='btn btn-info  ml-2 col-5'>
          繼續兌換
          <i class='fas fa-arrow-circle-right  ml-3' />
        </button>
      </div>
    </div>
  );
};

EventDeliverooSuccess.propTypes = {
  msg: PropTypes.string.isRequired,
  logs: PropTypes.array.isRequired,
  resetPage: PropTypes.func.isRequired
};

export default EventDeliverooSuccess;
