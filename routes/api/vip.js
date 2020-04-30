const express = require('express');
const router = express.Router();
const moment = require('moment');
const geoip = require('geoip-lite');
const VipModel = require('../../models/VipModel');
const smtp_server = require('../../config/config')['smtp_server'];
const validateVipOrderInput = require('../../validation/createVipOrder');
const nodemailer = require('nodemailer');
const {
  invoiceOptions,
  jwt_encryption,
  report_path,
} = require('../../config/service');

var jwt = require('jsonwebtoken');

router.post('/createOrder', async (req, res) => {
  const { errors, isValid } = validateVipOrderInput({
    ...req.body,
  });
  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    const ip = req.clientIp;
    const geo = geoip.lookup(ip);

    const report_id = `VP${moment().format('YYYYMMDDHHmmss')}${makeid(3)}`;
    const vip_ranking = await VipModel.getVipRankingByRoleNumber(
      req.body.roleId,
      req.body.gameId
    );

    let wireReportObject = {
      report_id,
      phone: req.body.userPhone,
      email: req.body.email,
      wire_code: req.body.wireCode,
      wire_time: req.body.wireTime,
      wire_amount: req.body.wireAmount,
      wire_name: req.body.wireName,
      bank_name: req.body.bankName,
      char_name: req.body.charName,
      role_id: req.body.roleId,
      server_id: req.body.serverId,
      game_id: req.body.gameId,
      ip,
      country: geo === null ? 'NULL' : geo.city,
      invoice_option: req.body.invoiceOption,
      address: req.body.area + req.body.address,
      product_id: req.body.productId,
      qty: req.body.qty,
      note: req.body.note,
      recipient: req.body.recipient,
      vip_ranking,
    };

    const result = await VipModel.createWireReport(wireReportObject);

    if (result.status === 1) {
      const recordResult = await VipModel.getReportByID(report_id);
      if (recordResult.status === 1) {
        const rptRecord = recordResult.msg;

        //產生token方便快速填入
        const token = jwt.sign(
          { report_id: rptRecord.report_id },
          jwt_encryption,
          {
            expiresIn: '180d',
          }
        );
        rptRecord.token = token;

        /// EMAIL /////
        if (process.env.NODE_ENV != 'development') {
          let transporter = nodemailer.createTransport(smtp_server);
          const fs = require('fs');

          let html_template = fs.readFileSync(
            __dirname + '/../../public/template/mail.html',
            'utf8'
          );
          const msg = `您的匯款回報單號為#${
            rptRecord.report_id
          },有問題可以隨時和服務人員聯繫!<br />
          <h5>下次可以透過<a href='${report_path}/wire_report/${
            rptRecord.game_id
          }?token=${token}'>您的專屬連結</a>使用預先載入資料的匯款回報單喔!</h5>

          以下是您的回報資料:<br />
          匯款帳號後五碼:${rptRecord.wire_code}<br />
          匯款時間:${rptRecord.wire_time}<br />
          匯款金額:${rptRecord.wire_amount}<br />
          匯款戶名:${rptRecord.wire_name}<br />
          銀行名稱:${rptRecord.bank_name}<br /><br />
          伺服器名稱:${rptRecord.server_name}<br />
          角色名稱:${rptRecord.char_name}<br />
          人物帳號ID:${rptRecord.role_id}<br />
          發票選項:${invoiceOptions[rptRecord.invoice_option]}<br />
          收件人:${rptRecord.recipient}<br />
          地址:${rptRecord.address}<br />
          購買方案:${rptRecord.title}<br />
          方案數量:${rptRecord.qty}<br />
          <hr />
          我們會盡快於服務時間幫您處理, 謝謝您!
          `;

          html_template = html_template.replace(
            /{{game_name}}/g,
            rptRecord.game_name
          );

          html_template = html_template.replace('{{msg}}', msg);
          html_template = html_template.replace(
            '{{year}}',
            new Date().getFullYear()
          );

          let mailOptions = {
            //$_SESSION['game_name']."客服代碼通知信[".date("Y/m/d H:i:s")."]",
            from: '"龍邑自動回覆系統" <no-reply@longeplay.com.tw>', // sender address
            to: rptRecord.email, // list of receivers
            subject: `${
              rptRecord.game_name
            }方案購買 - 匯款登記確認 ${moment().format('YYYY-MM-DD HH:mm:ss')}`, // Subject line
            html: html_template, // html body
          };

          // send mail with defined transport object
          let info = transporter.sendMail(mailOptions);

          //console.log("Message sent: %s", info.messageId);

          /// EMAIL /////
        }
        res.json({ msg: 'OK', record: rptRecord });
      } else {
        return res.status(500).json({ msg: '訂單回報失敗' });
      }
    } else {
      return res.status(500).json({ msg: result.msg });
    }
  }
});

const makeid = (length) => {
  var result = '';
  var characters = 'abcdefghijklmnpqrstuvwxyz';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

router.get('/checkWireReportToken/:token', async (req, res) => {
  const token = req.params.token;
  let decoded;
  try {
    decoded = jwt.verify(token, jwt_encryption);
  } catch (err) {
    return res.status(500).json({ msg: 'not valid' });
  }

  //console.log("decoded", decoded);
  if (decoded.report_id) {
    const report = await VipModel.getReportByID(decoded.report_id);
    if (report.status === 1) {
      const rptRecord = report.msg;

      res.json({ msg: 'OK', record: rptRecord });
    } else {
      return res.status(500).json({ msg: 'report not exist' });
    }
  } else {
    return res.status(500).json({ msg: 'not valid' });
  }
  //   console.log(decoded);
  //   "msg": {
  //     "report_id": "VP20191219150848ezw",
  //     "iat": 1576739328,
  //     "exp": 1577948928
  // }
});

router.get('/products/:game_id', async (req, res) => {
  const game_id = req.params.game_id;
  let products = await VipModel.getVipProductsByGameId(game_id);
  if (game_id === 'g66naxx2tw') {
    if (moment().format('YYYY-MM-DD HH:mm:ss') > '2020-05-01 00:00:00') {
      products = products.filter((prod) => prod.product_id !== '75084');
    } else {
      products = products.filter((prod) => prod.product_id === '75084');
    }
  }

  res.json({ msg: 'OK', products: products });
});

module.exports = router;
