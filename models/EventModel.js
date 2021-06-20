const { db1, db2 } = require("./db_conn");

const EventModel = {
  getSerailEvents: async (game_id, isWhiteListed = false) => {
    let conditionSql = "";
    if (!isWhiteListed) {
      conditionSql = " and begin_time < now() ";
    }
    return await db2
      .promise()
      .query(
        `select id,type, status,event_name,begin_time,end_time from events where type=2 and status <>0  and game_id=?  ${conditionSql} and end_time > now()`,
        [game_id]
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return { status: 1, msg: rows };
        } else {
          return { status: -1, msg: [] };
        }
      });
  },
  getEventById: async (event_id) => {
    return await db2
      .promise()
      .query(
        "select id,type, status,event_name,begin_time,end_time from events where type=2 and status <>0  and id=? and end_time > now()",
        [event_id]
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return { status: 1, msg: rows[0] };
        } else {
          return { status: -1, msg: [] };
        }
      });
  },
  getInputCount: async (event_id, char_id) => {
    return await db2
      .promise()
      .query(
        "SELECT count(*) as chk FROM log_serial_event WHERE status=0  and char_id=? and event_id=?",
        [char_id, event_id]
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return rows[0].chk;
        } else {
          return -1;
        }
      });
  },
  getSerialCode: async (event_id, serial_no) => {
    return await db2
      .promise()
      .query(
        "select id, status, event_sub_id from event_serial where event_id=? and serial=? ",
        [event_id, serial_no]
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return { status: 1, msg: rows[0] };
        } else {
          return { status: -1, msg: [] };
        }
      });
  },
  checkSubId: async (char_id, event_sub_id) => {
    return await db2
      .promise()
      .query(
        "select count(*) as chk from event_serial where  uid=? and event_sub_id=?  ",
        [char_id, event_sub_id]
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return rows[0].chk > 0;
        } else {
          return false;
        }
      });
  },
  addRedeemLog: async (logObject) => {
    return await db1
      .promise()
      .query("INSERT log_serial_event set ?", logObject)
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
  redeemSerial: async (char_id, serial_no, event_id, logId) => {
    // $this->db->where(array('substr(serial,1,16)'=>$data['serial'], 'event_id' => $event_id,'status' => '0'));
    // $this->db->update('event_serial',array("uid" => $char_id,"status" => 1));
    // console.log(
    //   `Update event_serial set uid=${char_id}, status=1 where serial='${serial_no}' and event_id=${event_id} and status=0 and event_sub_id not in(select event_sub_id from event_serial where uid=${char_id})`
    // );
    return await db1
      .promise()
      .query(
        "Update event_serial set uid=?, status=1 where serial=? and event_id=? and status=0",
        [char_id, serial_no, event_id]
      )
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          //console.log(`Update log_serial_event set status=1 where id=${logId}`);
          db1.query("Update log_serial_event set status=1 where id=?", [logId]);
          return { status: 1, msg: "更新成功" };
        } else {
          return { status: -1, msg: "更新失敗" };
        }
      })
      .catch((err) => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  getRedeemRecords: async (char_id, event_id) => {
    return await db2
      .promise()
      .query(
        "select b.title, a.serial from event_serial a left join serial_main b on a.event_sub_id = b.id where a.event_id=? and uid=?",
        [event_id, char_id]
      )
      .then(([rows, fields]) => {
        return rows;
      });
  },
  getSubeventCount: async (event_id) => {
    return await db2
      .promise()
      .query("SELECT count(*) as chk FROM serial_main WHERE event_id=?", [
        event_id,
      ])
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return rows[0].chk;
        } else {
          return -1;
        }
      });
  },
  getRedeemCountByPersonalId: async (event_id, personal_id) => {
    return await db2
      .promise()
      .query(
        "select count(*) as chk from event_serial where event_id=?  and personal_id=?  and status=1",
        [event_id, personal_id]
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return rows[0].chk;
        } else {
          return -1;
        }
      });
  },
  redeemSerialByPersonalId: async (
    char_id,
    email,
    serial_no,
    event_id,
    logId
  ) => {
    return await db1
      .promise()
      .query(
        "Update event_serial set personal_id=?, email=?, status=1 where serial=? and event_id=? and status=0",
        [char_id, email, serial_no, event_id]
      )
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          //console.log(`Update log_serial_event set status=1 where id=${logId}`);
          db1.query("Update log_serial_event set status=1 where id=?", [logId]);
          return { status: 1, msg: "更新成功" };
        } else {
          return { status: -1, msg: "更新失敗" };
        }
      })
      .catch((err) => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  getRedeemRecordsByPersonalId: async (char_id, event_id) => {
    return await db2
      .promise()
      .query(
        "select b.title, a.serial from event_serial a left join serial_main b on a.event_sub_id = b.id where a.event_id=? and personal_id=?",
        [event_id, char_id]
      )
      .then(([rows, fields]) => {
        return rows;
      });
  },

  checkWhaleEligibility: async (game_id, role_id, account_id) => {
    return await db2
      .promise()
      .query(
        `select uid,char_name, char_in_game_id, vip_ranking from whale_users where uid=? and site=? and char_in_game_id=? and vip_ranking  is not null`,
        [account_id, game_id, role_id]
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return rows[0];
        } else {
          return null;
        }
      });
  },

  addVerifyCode: async (record) => {
    return await db1
      .promise()
      .query("INSERT event_serial SET ?", record)
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

  getVerifyCode: async ({ event_id, uid, mobile }) => {
    return await db2
      .promise()
      .query(
        `select serial from event_serial where event_id=? and uid=? and mobile=? `,
        [event_id, uid, mobile]
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return rows[0];
        } else {
          return null;
        }
      });
  },
};

module.exports = EventModel;
