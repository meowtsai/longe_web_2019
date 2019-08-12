import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "moment-timezone";

const EventNote = ({ event: { event_id, end_time, event_name } }) => {
  return (
    <fieldset className="m-3">
      <legend>
        {" "}
        <i className="fas fa-clipboard mr-2 text-info" /> 使用注意事項
      </legend>

      <ul className="m-3 small">
        <li style={liStyle}>本序號僅提供《超機動聯盟》亞洲服玩家兌換。</li>
        <li style={liStyle}>
          序號可至遊戲 app 登錄頁 → 客服 → 線上回報 → 問題類型：{event_name}
          →填寫表單內容→送出。
        </li>
        <li style={liStyle}>
          序號可兌換期限至{" "}
          {moment(end_time)
            .tz("Asia/Taipei")
            .format("YYYY-MM-DD HH:mm:ss")}{" "}
          止。
        </li>
        <li style={liStyle}>
          <b>
            <u>同一獎項類別，每個遊戲帳號只能兌換一次。</u>
          </b>
        </li>
        <li style={liStyle}>每個序號僅限一次兌換。</li>
        <li style={liStyle}>錯誤達十次將鎖定兌獎功能。</li>
        <li style={liStyle}>
          獎項將於每週一晚上 23：59
          前，發送上一週「週一~週日」兌換成功之帳號，將以遊戲內郵件發送獎勵至所填寫的角色ID。
        </li>
      </ul>
    </fieldset>
  );
};

const liStyle = { listStyleType: "square", marginBottom: "0.5rem" };
EventNote.propTypes = {
  event: PropTypes.object.isRequired
};

export default EventNote;
