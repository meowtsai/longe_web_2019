import React from "react";

const RedeemRecords = ({ logs }) => {
  return (
    <ul className="list-group">
      <li className="list-group-item list-group-item-light small">
        以下是已成功兌換品項(發送時間請參考注意事項)
      </li>
      {logs.map(log => (
        <li
          key={log.serial}
          className="list-group-item list-group-item-info small"
        >
          <i className="far fa-gem" /> {log.title} (序號: {log.serial} )
        </li>
      ))}
    </ul>
  );
};

export default RedeemRecords;
