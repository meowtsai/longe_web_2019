import React, { useState } from 'react';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import isEmpty from '../../../validation/is-empty';
const ConfirmIssue = props => {
  const [issueType, setIssueType] = useState(null);

  const issue_options = [
    { label: '儲值扣款後未收到商品', value: 'topup_not_received' },
    { label: '我的帳號遺失,無法登入原本角色', value: 'account_lost' },
    { label: '帳號被盜用了', value: 'account_compromised' },
    { label: '其他問題', value: 'general_issue' }
  ];
  const search_values = queryString.parse(props.location.search);
  const home_link = !isEmpty(search_values.token)
    ? `/service_quick?token=${search_values.token}`
    : `/service_quick?param_game_id=${props.match.params.game_id}`;

  const nextStep = () => {
    // window.alert(issueType);
    let report_link = `/service/${props.match.params.game_id}/report-issue?form_id=${issueType}`;
    if (!isEmpty(search_values.token)) {
      report_link += `&token=${search_values.token}`;
    }
    props.history.push(report_link);
  };
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-lg-3 mt-3'> </div>
        <div className='col-lg-6  col-sm-12  mt-3'>
          <h4 className='text-center mt-5 mb-5'> 線上回報 </h4>{' '}
          <div className='card bg-light mb-3'>
            <div className='card-body'>
              <div className='card-text  mb-3'>
                為了能夠加速處理您的問題，請先確認問題類別．
              </div>
              <h5 className='card-title  mb-3'>我想要詢問關於....</h5>

              <select
                className='custom-select custom-select-lg mb-3'
                onChange={e => setIssueType(e.target.value)}
                defaultValue=''>
                <option value=''>==選擇問題類型==</option>
                {issue_options.map(issue => (
                  <option key={issue.value} value={issue.value}>
                    {issue.label}
                  </option>
                ))}
              </select>
            </div>
            <div className='card-footer text-muted'>
              <Link to={home_link} className='btn btn-secondary'>
                取消
              </Link>
              {issueType && (
                <button
                  onClick={nextStep}
                  className='btn btn-primary float-right'>
                  下一步
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmIssue.propTypes = {};

export default ConfirmIssue;
