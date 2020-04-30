const { db1, db2 } = require('./db_conn');

const VipModel = {
  createWireReport: async (reportObject) => {
    return await db1
      .promise()
      .query('INSERT vip_wire_report set ?', reportObject)
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          return { status: 1, msg: rows.insertId };
        } else {
          return { status: -1, msg: '新增失敗' };
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
        `select vw.report_id,vw.phone,vw.email, vw.wire_code,vw.wire_time,vw.wire_amount,vw.wire_name,vw.bank_name,vw.char_name,vw.role_id,vw.server_id,vw.game_id, gi.name as server_name, g.name as game_name ,vp.title,vw.qty,vw.invoice_option,vw.address,vw.recipient
        from vip_wire_report vw join servers gi on gi.server_id=vw.server_id join games g on g.game_id=gi.game_id 
        left join vip_products vp on vp.product_id=vw.product_id
        where report_id=? order by id asc`,
        [report_id]
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return { status: 1, msg: rows[0] };
        } else {
          return { status: -1, msg: '沒有符合的紀錄' };
        }
      })
      .catch((err) => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },

  getVipRankingByRoleNumber: async (role_no, game_id) => {
    return await db2
      .promise()
      .query(
        `SELECT vip_ranking  FROM whale_users where char_in_game_id =? and site =  ?;`,
        [role_no, game_id]
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return rows[0].vip_ranking;
        } else {
          return null;
        }
      })
      .catch((err) => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  getVipProductsByGameId: async (game_id) => {
    return await db2
      .promise()
      .query(`SELECT *  FROM vip_products where game_id =? order by price ;`, [
        game_id,
      ])
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return rows;
        } else {
          return null;
        }
      })
      .catch((err) => {
        //console.log(err);
        return null;
      });
  },
};

module.exports = VipModel;
