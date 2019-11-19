const { db1, db2 } = require("./db_conn");

const VipModel = {
  createWireReport: async reportObject => {
    return await db1
      .promise()
      .query("INSERT vip_wire_report set ?", reportObject)
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          return { status: 1, msg: rows.insertId };
        } else {
          return { status: -1, msg: "新增失敗" };
        }
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },

  getReportByID: async report_id => {
    return await db2
      .promise()
      .query(
        "select vw.order_id,vw.phone,vw.email, vw.wire_code,vw.wire_time,vw.wire_amount,vw.wire_name,vw.bank_name,vw.char_name,vw.role_id,vw.server_id,vw.game_id, gi.name as server_name, g.name as game_name from vip_wire_report vw join servers gi on gi.server_id=vw.server_id join games g on g.game_id=gi.game_id where order_id=? order by id asc",
        [report_id]
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return { status: 1, msg: rows[0] };
        } else {
          return { status: -1, msg: "沒有符合的紀錄" };
        }
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  }
};

module.exports = VipModel;
