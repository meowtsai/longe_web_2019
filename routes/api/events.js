const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const validateRedeemInput = require("../../validation/redeem");
const EventModel = require("../../models/EventModel");

router.get("/test", (req, res) => {
  res.json({ msg: "Events API Route works" });
});

//@route: GET /api/events/render_event_form/:event_id
//@desc: initial set up user data for serial redeem page
//@access: private
router.get("/render_event_form/:event_id", auth, async (req, res) => {
  const event_id = req.params.event_id;
  const event = await EventModel.getEventById(event_id);
  let rtn_data = { user: req.user };
  if (event.status !== 1) {
    return res.status(404).json({ msg: "活動不存在" });
  } else {
    //const initialState = { loading: false, user: {}, event: {}, logs: [] };

    const logs = await EventModel.getRedeemRecords(
      req.user.in_game_id,
      event_id
    );
    const queryCount = await EventModel.getInputCount(
      event_id,
      req.user.in_game_id
    );
    rtn_data.event = event.msg;
    rtn_data.logs = logs;
    rtn_data.redeem_status =
      logs.length > 1
        ? "COMPLETED"
        : queryCount > 9
        ? "REACH_LIMITED"
        : "NORMAL";
  }

  return res.json(rtn_data);
});

//@route: POST /api/events/redeem_serial_code
//@desc: redeem serial code
//@access: private
router.post("/redeem_serial_code/:event_id", auth, async (req, res) => {
  if (req.user) {
    //console.log(req.user);
    const { errors, isValid } = validateRedeemInput({
      ...req.body
    });
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const event_id = req.params.event_id;
    const serial_no = req.body.serial_no;
    //次數
    let tryCount = 0;
    const queryCount = await EventModel.getInputCount(
      event_id,
      req.user.in_game_id
    );

    let log = {
      partner_uid: req.user.partner_uid,
      char_id: req.user.in_game_id,
      char_name: req.user.character_name,
      ip: req.clientIp,
      serial: serial_no,
      event_id: event_id
    };
    //add log and get id
    const logRes = await EventModel.addRedeemLog(log);
    const logId = logRes.msg;

    tryCount = 9 - queryCount;
    if (queryCount > 9)
      return res
        .status(400)
        .json({ msg: "回報數量已達上限,若有疑問請回報客服!" });

    //序號
    const serial_detail = await EventModel.getSerialCode(event_id, serial_no);
    if (serial_detail.status !== 1) {
      return res
        .status(400)
        .json({ msg: `序號錯誤。 (剩餘次數: ${tryCount})` });
    } else if (serial_detail.msg.status === "1") {
      return res
        .status(400)
        .json({ msg: `序號已被使用。 (剩餘次數: ${tryCount})` });
    }

    //檢查
    const chkSub = await EventModel.checkSubId(
      req.user.in_game_id,
      serial_detail.msg.event_sub_id
    );

    if (chkSub) {
      return res.status(400).json({
        msg: `同一獎項類別，每個遊戲帳號只能兌換一次。(剩餘次數: ${tryCount})`
      });
    }

    const dbSerailData = serial_detail.msg;
    //兌換
    const redeem_result = await EventModel.redeemSerial(
      req.user.in_game_id,
      serial_no,
      event_id,
      logId
    );
    //console.log("redeem_result", redeem_result);
    if (redeem_result.status === 1) {
      const logs = await EventModel.getRedeemRecords(
        req.user.in_game_id,
        event_id
      );
      res.json({
        status: 1,
        msg: "兌換成功，獎項發送時間請參考注意事項。",
        logs
      });
    } else {
      return res.status(400).json({
        msg: `兌換失敗, 可能是:序號錯誤/已被使用/同組獎品僅限一次。 (剩餘次數: ${tryCount})`
      });
    }
  } else {
    return res.status(400).json({ msg: "驗證失敗" });
  }
});

module.exports = router;
