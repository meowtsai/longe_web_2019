import React from 'react';
import PropTypes from 'prop-types';
import RedeemRecords from './RedeemRecords';

const EventDeliverooSuccess = ({ msg, logs, resetPage }) => {
  return (
    <div className='alert alert-success'>
      <h4 class='alert-heading'>兌換成功</h4>
      <p>
        獎項將於 2020/3/31 晚上 23：59 前，以遊戲內郵件發送至所填寫的角色ID。
      </p>
      <hr />
      <p class='mb-0'>
        <RedeemRecords logs={logs} />
      </p>
      <div className='text-center mt-3'>
        <a
          href='https://game.longeplay.com.tw/'
          className='btn btn-secondary  col-4'>
          <i class='fas fa-arrow-circle-left  mr-3' />
          取消
        </a>
        <button onClick={resetPage} className='btn btn-info  ml-3 col-4'>
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
