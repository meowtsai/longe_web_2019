import React from 'react';
import PropTypes from 'prop-types';

const InvitationPanel = ({ game_id, line_invite_link, device }) => {
  const line_account_name =
    game_id === 'g66naxx2tw' ? '瑞秋電台' : '莊園小管家';
  return (
    <div className='col-md-6 mt-3'>
      <span className='badge badge-info'>訊息</span>{' '}
      <small>
        邀請您加入 LINE 官帳:
        <mark>{line_account_name}</mark>
      </small>
      <i className='fas fa-arrow-right mr-1 ml-1 text-danger'></i>
      {device === 'Android' && game_id === 'g66naxx2tw' ? (
        <a href={`/guide/line_add.html`}>
          <img
            src='https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png'
            alt='加入好友'
            height='36'
            border='0'
          />
        </a>
      ) : (
        <a href={`https://line.me/R/ti/p/${line_invite_link}`}>
          <img
            src='https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png'
            alt='加入好友'
            height='36'
            border='0'
          />
        </a>
      )}
    </div>
  );
};

InvitationPanel.propTypes = {};

export default InvitationPanel;
