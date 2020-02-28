import React, { useState } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import Alert from '../common/Alert';
import {
  deliverooVerify,
  resetDeliverooPage
} from '../../actions/eventActions';
import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import EventDeliverooSuccess from './EventDeliverooSuccess';
const EventDeliveroo = ({
  event: { event, loading, logs, redeem_msg, redeem_status },
  errors,
  deliverooVerify,
  resetDeliverooPage
}) => {
  const [email, setEmail] = useState('');
  const [server_name, setServerName] = useState('');
  const [char_id, setCharId] = useState('');
  const [character_name, setCharacterName] = useState('');
  const [serial_no, setSerail] = useState('');

  let serversOption = [
    { label: '手機版', value: 'mobile' },
    { label: 'PC伺服器 - 日本', value: 'pc_japan' },
    { label: 'PC伺服器 - 北美', value: 'pc_north_america' },
    { label: 'PC伺服器 - 東南亞', value: 'pc_se_asia' },
    { label: 'PC伺服器 - 國際', value: 'pc_i10n' },
    { label: '請選擇', value: '' }
  ];

  const onClickNext = () => {
    const data = {
      email,
      server_name,
      character_name,
      char_id,
      serial_no
    };

    deliverooVerify(data);
  };

  const resetPage = () => {
    setEmail('');
    setServerName('');
    setCharId('');
    setCharacterName('');
    setSerail('');

    resetDeliverooPage();
  };
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-sm-12 col-md-9 col-lg-6 m-auto'>
          <h4 className='text-center mt-5'>
            <span className='input-group-text' role='img' aria-label='pc'>
              🎁
            </span>{' '}
            兌獎中心{' '}
            <span className='input-group-text' role='img' aria-label='pc'>
              🎁
            </span>
          </h4>
          <div>
            {redeem_msg ? (
              <EventDeliverooSuccess
                msg={redeem_msg}
                logs={logs}
                resetPage={resetPage}
              />
            ) : (
              <table className='table table-bordered'>
                <thead>
                  <tr>
                    <th nowrap='true' scope='col'>
                      活動名稱
                    </th>
                    <td>
                      <span>荒野行動x戶戶送虛寶兌換</span>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope='row'>伺服器</th>
                    <td>
                      <SelectListGroup
                        placeholder='伺服器'
                        name='server_name'
                        value={server_name}
                        onChange={e => setServerName(e.target.value)}
                        error={errors.server_name}
                        options={serversOption}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th scope='row'>角色ID：</th>
                    <td>
                      <TextFieldGroup
                        placeholder='* 角色ID'
                        name='char_id'
                        onChange={e => setCharacterName(e.target.value)}
                        type='text'
                        value={char_id}
                        onChange={e => {
                          setCharId(e.target.value);
                        }}
                        error={errors.char_id}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th scope='row'>角色名：</th>
                    <td>
                      <TextFieldGroup
                        placeholder='* 角色名稱'
                        name='character_name'
                        onChange={e => setCharacterName(e.target.value)}
                        type='text'
                        value={character_name}
                        onChange={e => {
                          setCharacterName(e.target.value);
                        }}
                        error={errors.character_name}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th scope='row'>Email：</th>
                    <td>
                      <TextFieldGroup
                        placeholder='* Email'
                        name='email'
                        onChange={e => setEmail(e.target.value)}
                        type='text'
                        value={email}
                        onChange={e => {
                          setEmail(e.target.value);
                        }}
                        error={errors.email}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th scope='row'>序號</th>
                    <td>
                      <TextFieldGroup
                        placeholder='* 序號'
                        name='serial_no'
                        type='text'
                        value={serial_no}
                        onChange={e => {
                          setSerail(e.target.value);
                        }}
                        error={errors.serial_no}
                        info='請輸入兌換序號'
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan='2'>
                      <div className='text-center'>
                        {errors.msg && <Alert msg={errors.msg} />}
                        <a
                          href='https://game.longeplay.com.tw/'
                          className='btn btn-secondary  col-4'>
                          <i class='fas fa-arrow-circle-left  mr-3' />
                          取消
                        </a>
                        <button
                          onClick={onClickNext}
                          className='btn btn-info  ml-3 col-4'>
                          確認兌換
                          <i class='fas fa-arrow-circle-right  ml-3' />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan='2'>
                      <fieldset className='m-3'>
                        <legend>
                          {' '}
                          <i className='fas fa-clipboard mr-2 text-info' />{' '}
                          使用注意事項
                        </legend>

                        <div className='card'>
                          <div className='card-body'>
                            <ul className='m-3 small'>
                              <li style={liStyle}>
                                本序號提供有下載「荒野行動」並註冊帳號的用戶使用。
                              </li>
                              <li style={liStyle}>
                                取得序號後，請至活動網頁荒野行動x戶戶送虛寶兌換→填寫表單內容→確認兌換。
                              </li>
                              <li style={liStyle}>
                                禮包內容物說明：
                                <ul>
                                  <li style={liStyle2}>
                                    {' '}
                                    「蝶步舞曲禮包」
                                    可獲得頭像框-恭喜發財（1天）*6，另外有機會獲得蝶步舞曲套裝等多種稀有外觀獎勵
                                  </li>
                                  <li style={liStyle2}>
                                    「白墨忍者福袋」
                                    可獲得頭像框-恭喜發財（1天）*4，另外有機會獲得白墨忍者裝等多種稀有外觀獎勵
                                  </li>
                                  <li style={liStyle2}>
                                    「武士魂印福袋」
                                    可獲得頭像框-恭喜發財（1天）*4，另外有機會獲得武士魂印裝等多種稀有外觀獎勵
                                  </li>
                                </ul>
                              </li>
                              <li style={liStyle}>
                                序號兌換期限至 2020/3/20 晚上 23：59
                                止，逾期則無法兌換。
                              </li>
                              <li style={liStyle}>
                                <b>
                                  <u>每個遊戲帳號，最多可兌換3次活動序號。</u>
                                </b>
                              </li>

                              <li style={liStyle}>
                                獎項將於 2020/3/31 晚上 23：59
                                前，以遊戲內郵件發送至所填寫的角色ID。{' '}
                              </li>
                              <li style={liStyle}>
                                此卡序號不得出售或兌換現金。
                              </li>
                            </ul>
                          </div>
                        </div>
                      </fieldset>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

EventDeliveroo.propTypes = {
  deliverooVerify: PropTypes.func.isRequired,
  resetDeliverooPage: PropTypes.func.isRequired
};
const liStyle = { listStyleType: 'square', marginBottom: '0.5rem' };
const liStyle2 = { color: '#2458a1' };
const mapStateToProps = state => ({
  event: state.event,
  errors: state.errors
});
export default connect(mapStateToProps, {
  deliverooVerify,
  resetDeliverooPage
})(EventDeliveroo);
