const express = require("express");
const router = express.Router();
var jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const auth_for_create = require("../../middleware/auth_for_create");
const geoip = require("geoip-lite");

const Validator = require("validator");
const uniqid = require("uniqid");
const md5 = require("md5");
const path = require("path");
const isEmpty = require("../../validation/is-empty");

const validateQuestionQueryInput = require("../../validation/question_query");
const validateReplyInput = require("../../validation/reply");
const validateCreateWebInput = require("../../validation/create");
const nl2br = require("../../validation/nl2br");
const nodemailer = require("nodemailer");
const smtp_server = require("../../config/config")["smtp_server"];

const ServiceModel = require("../../models/ServiceModel");
const GameModel = require("../../models/GameModel");
const EventModel = require("../../models/EventModel");
const moment = require("moment");
const SERVICE_CONFIG = require("../../config/service");

router.get("/test", (req, res) => {
  res.json({ msg: "Questions API Route works" });
});

//@route: POST /api/question/by_checkid
//@desc: get a question by email,phone, checkid
//@access: public

router.post("/by_checkid", (req, res) => {
  //console.log("req.body", req.body);
  const { errors, isValid } = validateQuestionQueryInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, mobile, check_id } = req.body;

  ServiceModel.getQuestionByCheckID(check_id, email, mobile).then(qResult => {
    if (qResult.status != 1) {
      return res.status(404).json({ noexist: "查找的問題不存在" });
    } else {
      //console.log(qResult);
      const jsonToBeSinged = {
        check_id,
        email,
        mobile,
        question_id: qResult.msg.id
      };

      jwt.sign(
        jsonToBeSinged,
        SERVICE_CONFIG.jwt_encryption,
        {
          expiresIn: "7d"
        },
        (err, token) => {
          //console.log(token);
          if (err) throw err;
          res.json({ status: 1, msg: { token, ...jsonToBeSinged } });
        }
      );
    }
  });
});

//@route: GET /api/questions/view/:q_id
//@desc: get question content by id
//@access: private
router.get("/view/:q_id", auth, (req, res) => {
  if (req.user) {
    let question = {};
    let replies = [];
    let criteria = {};
    if (!isEmpty(req.user.partner_uid)) {
      criteria = {
        partner_uid: req.user.partner_uid,
        question_id: req.params.q_id
      };
    } else {
      criteria = {
        check_id: req.user.check_id,
        question_id: req.user.question_id
      };
    }
    ServiceModel.getQuestionByID(criteria)
      .then(qResult => {
        if (qResult.status == 1) {
          question = {
            ...qResult.msg,
            type_text: SERVICE_CONFIG.question_types[qResult.msg.type]
          };
          //console.log("question", question);
          return ServiceModel.getRepliesByQID(question.id);
        } else {
          return res.status(404).json({ noexist: "問題不存在" });
        }
      })
      .then(rResult => {
        replies = [...rResult.msg];
        question = {
          ...question,
          replies
        };
        return ServiceModel.getPicplusByQID(question.id);
      })
      .then(pResult => {
        pic_plus = [...pResult.msg];
        return res.json({ status: 1, msg: { ...question, pic_plus } });
      })
      .catch(err => {
        return res.status(400).json({ errors: err.message });
      });
  }
});

//@route: GET /api/questions/list/
//@desc: get question list by user
//@access: private
router.get("/list", auth, (req, res) => {
  if (req.user) {
    ServiceModel.getQuestions(
      req.user.partner_uid,
      req.user.server_info.server_id
    ).then(listResult => {
      if (listResult.status == 1) {
        return res.json(listResult);
      } else {
        return res.status(404).json({ noexist: "問題不存在" });
      }
    });
  }
});

//@route: POST /api/questions/insert_reply
//@desc: POST question_reply
//@access: private
router.post("/insert_reply", auth, (req, res) => {
  //console.log("insert_reply", req.user);
  if (req.user) {
    //console.log(req.user);
    const { errors, isValid } = validateReplyInput({
      ...req.body,
      files: req.files,
      ip: req.clientIp
    });
    if (!isValid) {
      return res.status(400).json(errors);
    }

    let criteria = {};
    if (!isEmpty(req.user.partner_uid)) {
      criteria = {
        partner_uid: req.user.partner_uid,
        question_id: req.body.question_id
      };
    } else {
      criteria = {
        check_id: req.user.check_id,
        question_id: req.user.question_id
      };
    }
    ServiceModel.getQuestionByIDQuickCheck(criteria).then(qExist => {
      if (qExist) {
        const question_id = !isEmpty(req.user.partner_uid)
          ? req.body.question_id
          : req.user.question_id;

        let replyObject = {
          uid: 0,
          question_id,
          content: nl2br(Validator.escape(req.body.content))
        };

        let add_pics = [];

        if (!isEmpty(req.files)) {
          //console.log("req.files", req.files);
          if (Object.keys(req.files).length > 0) {
            Object.keys(req.files).forEach((keyName, index) => {
              const new_file_name =
                set_filename() +
                path.extname(req.files[keyName].name).toLowerCase();

              add_pics.push(SERVICE_CONFIG.image_path + new_file_name);

              req.files[keyName].mv(
                `${SERVICE_CONFIG.image_upload_dir}${new_file_name}`,
                err => {
                  if (err) return res.status(500).send({ file01: err.message });
                }
              );
            });
          }
        }
        let rtnMsg = {};
        ServiceModel.checkRepeactReplies(question_id)
          .then(chkResult => {
            //console.log(chkResult);
            if (chkResult.status > 0) {
              return res.status(400).json({ errors: "請勿重複提問!" });
            } else {
              return ServiceModel.insertReply(replyObject, add_pics);
            }
          })
          .then(insResult => {
            if (insResult.status !== 1) {
              return res.status(400).json({ errors: insResult.msg });
            }

            return ServiceModel.openQuestion(question_id);
          })
          .then(setResult => {
            return ServiceModel.getRepliesByQID(question_id);
          })
          .then(gResult => {
            rtnMsg.replies = [...gResult.msg];
            return ServiceModel.getPicplusByQID(question_id);
          })
          .then(pResult => {
            rtnMsg.pic_plus = [...pResult.msg];
            //console.log("rtnMsg", rtnMsg);
            res.json({ status: 1, msg: rtnMsg });
          })
          .catch(err => {
            return res.status(400).json({ errors: err.message });
          });
      } else {
        return res.status(404).json({ noexist: "問題不存在" });
      }
    });
  }
});

//@route: POST /api/questions/close_question
//@desc: POST to close a question
//@access: private
router.post("/close_question", auth, (req, res) => {
  if (req.user) {
    let criteria = {};
    if (!isEmpty(req.user.partner_uid)) {
      criteria = {
        partner_uid: req.user.partner_uid,
        question_id: req.body.question_id
      };
    } else {
      criteria = {
        check_id: req.user.check_id,
        question_id: req.user.question_id
      };
    }

    //console.log("close_question criteria", criteria);

    ServiceModel.closeQuestion(criteria).then(cResult => {
      res.json(cResult);
    });
  }
});

//@route: GET /api/question/get_user_by_token
//@desc: get user by verify its token
//@access: private
router.get("/get_user_by_token", auth, (req, res) => {
  if (req.user) {
    //console.log(req.user);
    res.json({ ...req.user, question_types: SERVICE_CONFIG.question_types });
  }
});

//@route: GET /api/question/render_create_form
//@desc: get user by verify its token
//@access: private
router.get(
  "/render_create_form/:game_id",
  auth_for_create,
  async (req, res) => {
    const game_id = req.params.game_id;
    let rtn_data = {
      game: {},
      user: {}
    };

    const game = await GameModel.getGameById(game_id);
    const servers = await GameModel.getServersByGameId(game_id);
    const faq_result = await GameModel.getFaqByGameId(game_id);
    const events = await EventModel.getSerailEvents(game_id, req.whitelisted);

    rtn_data = {
      game: { game_id, game_name: game.msg.game_name, servers: servers.msg },
      user: req.user,
      faq: [...faq_result.msg],
      question_types: SERVICE_CONFIG.question_types,
      events: events.msg
    };

    //console.log("render_create_form", Date.now());

    return res.json(rtn_data);

    //   GameModel.getGameById(game_id)
    //     .then(game => {
    //       rtn_data.game = { game_id, game_name: game.msg.game_name };
    //       return GameModel.getServersByGameId(game_id);
    //     })
    //     .then(servers => {
    //       rtn_data = {
    //         game: {
    //           ...rtn_data.game,
    //           servers: servers.msg
    //         },

    //         question_types: SERVICE_CONFIG.question_types
    //       };

    //       return GameModel.getFaqByGameId(game_id);
    //     })
    //     .then(faq_result => {
    //       if (req.user) {
    //         //in game report
    //         rtn_data.user = req.user;
    //       }
    //       rtn_data.faq = [...faq_result.msg];
    //       console.log("render_create_form", Date.now());
    //       res.json(rtn_data);
    //     })
    //     .catch(err => {
    //       res.json(err.message);
    //     });
  }
);

//@route: POST /api/questions/create_web_form
//@desc: POST create_web_form
//@access: public
router.post("/create_web_form", (req, res) => {
  let { errors, isValid } = validateCreateWebInput({
    ...req.body,
    files: req.files,
    ip: req.clientIp
  });
  //console.log("create_web_form", req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const ip = req.clientIp;
  const geo = geoip.lookup(ip);

  //console.log("ip", ip);
  //console.log("geo", geo);
  //TODO: implement google api validation here
  let game_id = req.body.game_id;
  let game_name = req.body.game_name;
  let partner_uid = null;
  let is_in_game = 0;
  let note = isEmpty(req.body.note)
    ? ""
    : req.body.note.replace("undefined", "");
  if (!isEmpty(req.body.partner_uid)) {
    partner_uid = req.body.partner_uid;
    is_in_game = 1;
  }

  let questionObject = {
    uid: 0,
    partner_uid: partner_uid,
    type: req.body.question_type,
    server_id: req.body.server_id,
    character_name: Validator.escape(req.body.character_name),
    content: nl2br(Validator.escape(req.body.content)),
    is_in_game: is_in_game,
    phone: req.body.phone,
    email: req.body.email,
    check_id: getCheckId(),
    is_quick: 1,
    update_time: new Date(),
    ip: ip,
    country: geo === null ? "NULL" : geo.country,
    note
  };
  let add_pics = [];
  //console.log("QuestionObject", questionObject);
  //console.log("req.body", req.body);
  //TODO: UPLOAD
  if (!isEmpty(req.files)) {
    //console.log("req.files", req.files);
    if (Object.keys(req.files).length > 0) {
      Object.keys(req.files).forEach((keyName, index) => {
        const new_file_name =
          set_filename() + path.extname(req.files[keyName].name).toLowerCase();

        if (index < 3) {
          questionObject = {
            ...questionObject,
            [`pic_path${index + 1}`]: SERVICE_CONFIG.image_path + new_file_name
          };
        } else {
          add_pics.push(SERVICE_CONFIG.image_path + new_file_name);
        }

        req.files[keyName].mv(
          `${SERVICE_CONFIG.image_upload_dir}${new_file_name}`,
          err => {
            if (err) return res.status(500).send({ file01: err.message });
          }
        );
      });
    }
  }

  //TODO: INSERT PICs DATA
  ServiceModel.createQuestion(questionObject, add_pics)
    .then(createResult => {
      if (createResult.status === 1) {
        const q_id = createResult.msg;

        const jsonToBeSinged = {
          check_id: questionObject.check_id,
          email: questionObject.email,
          mobile: questionObject.phone,
          question_id: createResult.msg
        };

        jwt.sign(
          jsonToBeSinged,
          SERVICE_CONFIG.jwt_encryption,
          {
            expiresIn: "7d"
          },
          (err, token) => {
            //console.log(token);
            if (err) throw err;

            /// EMAIL /////
            if (process.env.NODE_ENV != "development" && !is_in_game) {
              let transporter = nodemailer.createTransport(smtp_server);
              const fs = require("fs");

              let html_template = fs.readFileSync(
                __dirname + "/../../public/template/mail.html",
                "utf8"
              );
              const msg = `您提問的案件單號為#${q_id}<br />後續若要<a href='${SERVICE_CONFIG.report_path}/service/${game_id}/view/${q_id}?token=${token}'>追蹤此單號</a>的客服問題請用以下代碼進行查詢：<br /><b>${questionObject.check_id}</b>`;

              html_template = html_template.replace(
                /{{game_name}}/g,
                game_name
              );

              html_template = html_template.replace("{{msg}}", msg);
              html_template = html_template.replace(
                "{{year}}",
                new Date().getFullYear()
              );

              let mailOptions = {
                //$_SESSION['game_name']."客服代碼通知信[".date("Y/m/d H:i:s")."]",
                from: '"龍邑自動回覆系統" <no-reply@longeplay.com.tw>', // sender address
                to: questionObject.email, // list of receivers
                subject: `${game_name}客服代碼通知信 ${moment().format(
                  "YYYY-MM-DD HH:mm:ss"
                )}`, // Subject line
                html: html_template // html body
              };

              // send mail with defined transport object
              let info = transporter.sendMail(mailOptions);

              //console.log("Message sent: %s", info.messageId);

              /// EMAIL /////
            }
            res.json({ status: 1, msg: { token, ...jsonToBeSinged } });
          }
        );
      } else {
        return res.status(400).json(createResult);
      }
    })
    .catch(err => {
      return res.status(400).json({ errors: err.message });
    });
});

getCheckId = () =>
  new Date()
    .getTime()
    .toString(32)
    .substr(0, 7);

//136affa810126df66904cfb67c356031.png
//def154ac90ac1f765f4df8c3d109bb9c.jpg
set_filename = () => md5(uniqid());
module.exports = router;
