const { db1, db2 } = require("./db_conn");

const VipV2Model = {
  getLogById: async (report_id) => {
    return await db1
      .promise()
      .query(`select * from log_vipv2_report where report_id=?`, [report_id])
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return { status: 1, msg: rows[0] };
        } else {
          return { status: -1, msg: "沒有符合的紀錄" };
        }
      })
      .catch((err) => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  createStep1log: async (log) => {
    return await db1
      .promise()
      .query("INSERT log_vipv2_report set ?", log)
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          return { status: 1, msg: rows.insertId };
        } else {
          return { status: -1, msg: "新增失敗" };
        }
      })
      .catch((err) => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  getReportByID: async (report_id) => {
    return await db1
      .promise()
      .query(
        `select vw.report_id,vw.phone,vw.email, vw.wire_code,vw.wire_time,vw.wire_amount,vw.wire_name,vw.bank_name,vw.char_name,vw.role_id,vw.server_id,vw.game_id, vw.invoice_option,vw.address,vw.recipient,log.area, log.gender,log.birthday
        from vip_wire_report vw left join log_vipv2_report log on vw.report_id =log.report_id
        where vw.report_id=? order by vw.report_id asc`,
        [report_id]
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return { status: 1, msg: rows[0] };
        } else {
          return { status: -1, msg: "沒有符合的紀錄" };
        }
      })
      .catch((err) => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
};

module.exports = VipV2Model;
