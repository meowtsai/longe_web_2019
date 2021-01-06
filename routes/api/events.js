const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const validateRedeemInput = require("../../validation/redeem");
const validateDeliverooInput = require("../../validation/deliveroo");
const validateSurveyInput = require("../../validation/survey");

const smtp_server = require("../../config/config")["smtp_server"];
const moment = require("moment");
const nodemailer = require("nodemailer");
const EventModel = require("../../models/EventModel");
const eventConfig = require("../../config/event");

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
    const subEventCount = await EventModel.getSubeventCount(event_id);

    rtn_data.event = event.msg;
    rtn_data.logs = logs;
    rtn_data.redeem_status =
      logs.length >= subEventCount
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
      ...req.body,
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
      event_id: event_id,
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
      return res.status(400).json({ msg: `序號錯誤。` });
    } else if (serial_detail.msg.status === "1") {
      return res.status(400).json({ msg: `序號已被使用。` });
    }

    //檢查
    const chkSub = await EventModel.checkSubId(
      req.user.in_game_id,
      serial_detail.msg.event_sub_id
    );

    if (chkSub) {
      return res.status(400).json({
        msg: `同一獎項類別，每個遊戲帳號只能兌換一次。`,
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
        logs,
      });
    } else {
      return res.status(400).json({
        msg: `兌換失敗, 可能是:序號錯誤/已被使用/同組獎品僅限一次。`,
      });
    }
  } else {
    return res.status(400).json({ msg: "驗證失敗" });
  }
});

//@route: POST /api/events/verify_deliveroo
//@desc: verify_deliveroo code and data
//@access: private
router.post("/verify_deliveroo", async (req, res) => {
  //console.log('req.body', req.body);
  if (eventConfig.survey_start < moment().format("YYYY-MM-DD")) {
    return res.status(400).json({
      msg: `問卷活動尚未開始。`,
    });
  }

  if (eventConfig.survey_end > moment().format("YYYY-MM-DD")) {
    return res.status(400).json({
      msg: `問卷活動已經截止。`,
    });
  }

  const { errors, isValid } = validateDeliverooInput({
    ...req.body.data,
  });
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const serversOption = [
    { label: "手機版", value: "mobile" },
    { label: "PC伺服器 - 日本", value: "pc_japan" },
    { label: "PC伺服器 - 北美", value: "pc_north_america" },
    { label: "PC伺服器 - 東南亞", value: "pc_se_asia" },
    { label: "PC伺服器 - 國際", value: "pc_i10n" },
  ];
  const event_id = 24;
  const tryCount = 0;
  const {
    email,
    char_id,
    server_name,
    character_name,
    serial_no,
  } = req.body.data;

  let log = {
    char_id: char_id,
    char_name: character_name,
    ip: req.clientIp,
    serial: serial_no,
    event_id: event_id,
    note: server_name,
  };

  //add log and get id
  const logRes = await EventModel.addRedeemLog(log);
  const logId = logRes.msg;

  //檢查每個遊戲帳號，最多可兌換3次活動序號
  //select count(*) from event_serial where personal_id=? and event_id=24
  const chkcount = await EventModel.getRedeemCountByPersonalId(
    event_id,
    char_id
  );
  if (chkcount >= 3) {
    return res.status(400).json({
      msg: `每個遊戲帳號最多可兌換 3 次活動序號。(已經兌換次數: ${chkcount})`,
    });
  }

  //檢查序號
  const serial_detail = await EventModel.getSerialCode(event_id, serial_no);
  if (serial_detail.status !== 1) {
    return res.status(400).json({ msg: `序號錯誤，請輸入正確序號。` });
  } else if (serial_detail.msg.status === "1") {
    return res.status(400).json({ msg: `序號已被使用。` });
  }

  //兌換序號
  //兌換
  const redeem_result = await EventModel.redeemSerialByPersonalId(
    char_id,
    email,
    serial_no,
    event_id,
    logId
  );
  //console.log("redeem_result", redeem_result);
  if (redeem_result.status === 1) {
    /// EMAIL /////
    if (process.env.NODE_ENV != "development") {
      let transporter = nodemailer.createTransport(smtp_server);
      const fs = require("fs");

      let html_template = fs.readFileSync(
        __dirname + "/../../public/template/mail.html",
        "utf8"
      );

      const msg = `感謝您參與荒野行動*戶戶送虛寶兌換活動!

      您本次登錄成功的資訊如下:<br />
      伺服器名稱:${
        serversOption.filter((s) => s.value === server_name)[0].label
      }<br />
      角色名稱:${character_name}<br />
      角色id：:${char_id}<br />
      序號：:${serial_no}<br />
      獎勵內容:「蝶步舞曲禮包*1」+「白墨忍者福袋*1」+「武士魂印福袋*1」<br />
  
      <hr />
      獎項將於 2020/3/31 晚上 23：59 前，以遊戲內郵件發送至所填寫的角色ID!
      `;

      html_template = html_template.replace(/{{game_name}}/g, "荒野行動");

      html_template = html_template.replace("{{msg}}", msg);
      html_template = html_template.replace(
        "{{year}}",
        new Date().getFullYear()
      );

      let mailOptions = {
        //$_SESSION['game_name']."客服代碼通知信[".date("Y/m/d H:i:s")."]",
        from: '"龍邑自動回覆系統" <no-reply@longeplay.com.tw>', // sender address
        to: email, // list of receivers
        subject: `荒野行動*戶戶送虛寶兌獎通知信 ${moment().format(
          "YYYY-MM-DD HH:mm:ss"
        )}`, // Subject line
        html: html_template, // html body
      };

      // send mail with defined transport object
      let info = transporter.sendMail(mailOptions);

      //console.log("Message sent: %s", info.messageId);

      /// EMAIL /////
    }

    const logs = await EventModel.getRedeemRecordsByPersonalId(
      char_id,
      event_id
    );
    res.json({
      status: 1,
      msg: "兌換成功，獎項發送時間請參考注意事項。",
      logs,
    });
  } else {
    return res.status(400).json({
      msg: `兌換失敗, 可能是:序號錯誤/已被使用。`,
    });
  }
});

//@route: POST /api/events/surveylogin
//@desc: verify survey whale userlog in
//@access: private
router.post("/surveylogin", async (req, res) => {
  //  console.log(req.body);

  const survey_start = moment(eventConfig.survey_start).format("YYYY-MM-DD");
  const survey_end = moment(eventConfig.survey_end).format("YYYY-MM-DD");
  const now = moment().format("YYYY-MM-DD");

  if (moment(now).isBefore(survey_start)) {
    return res.status(400).json({
      message: `問卷活動尚未開始。`,
    });
  }

  if (moment(now).isAfter(survey_end)) {
    return res.status(400).json({
      message: `問卷活動已經截止。`,
    });
  }

  //基本驗證role & account

  const { errors, isValid } = validateSurveyInput({
    ...req.body,
  });
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { gameId, roleId, accountId } = req.body;
  //db驗證role & account
  const whaleRecord = await EventModel.checkWhaleEligibility(
    gameId,
    roleId,
    accountId
  );

  if (whaleRecord) {
    //檢查是否已經有驗證碼了
    const existCode = await EventModel.getVerifyCode({
      event_id: 25,
      uid: whaleRecord.uid,
      mobile: whaleRecord.char_in_game_id,
    });
    if (existCode) {
      res.json({
        status: 2,
        record: whaleRecord,
        code: existCode.serial,
      });

      return;
    }

    const randomCode = makeid(6).toUpperCase();

    const codeRecord = {
      event_id: 25,
      uid: whaleRecord.uid,
      personal_id: whaleRecord.char_name,
      mobile: whaleRecord.char_in_game_id,
      serial: randomCode,
    };
    const addResult = await EventModel.addVerifyCode(codeRecord);

    if (addResult.status === 1) {
      res.json({
        status: 1,
        record: whaleRecord,
        code: randomCode,
      });
    } else {
      return res.status(400).json({
        message: addResult.msg,
      });
    }
  } else {
    return res.status(400).json({
      message: `驗證失敗,請確認您的帳號和角色正確, 另外提醒您, 本次問卷邀請對象僅限於我們的專屬客戶喔!`,
    });
  }
});

module.exports = router;

const makeid = (length) => {
  var result = "";
  var characters = "abcdefghijklmnpqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
