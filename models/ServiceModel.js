const { db1, db2 } = require("./db_conn");
const isEmpty = require("../validation/is-empty");
const ServiceModel = {
  getUnreadByUID: async partner_uid => {
    return await db2
      .promise()
      .query(
        `select count(id) as cnt from questions where partner_uid= ? and status=2 and is_read=0`,
        partner_uid
      )
      .then(([rows, fields]) => rows[0])
      .catch(err => {
        //console.log(err);
        return rows[0];
      });
  },
  getQuestionByCheckID: async (check_id, email, phone) => {
    let sqlSelect = "SELECT id FROM `questions`  WHERE  check_id=?";
    let condition = [check_id];
    if (!isEmpty(email)) {
      sqlSelect += " and email=?";
      condition.push(email);
    }
    if (!isEmpty(phone)) {
      sqlSelect += " and phone=?";
      condition.push(phone);
    }
    return await db2
      .promise()
      .query(sqlSelect, condition)
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return { status: 1, msg: rows[0] };
        } else {
          return { status: -1, msg: "沒有符合的提問紀錄" };
        }
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  getQuestionByID: async criteria => {
    let sqlQuery =
      "SELECT q.id,q.type,q.content,q.server_id,q.character_name,q.partner_uid,q.pic_path1,q.pic_path2,q.pic_path3, q.create_time, q.status, q.phone,q.email, g.name as game_name, gi.name as server_name FROM questions  q join servers gi on gi.server_id=q.server_id join games g on g.game_id=gi.game_id WHERE  q.id=?";
    if (!isEmpty(criteria.partner_uid)) {
      sqlQuery += " and q.partner_uid=?";
    } else {
      sqlQuery += " and q.check_id=?";
    }
    return await db2
      .promise()
      .query(sqlQuery, [
        criteria.question_id,
        !isEmpty(criteria.partner_uid)
          ? criteria.partner_uid
          : criteria.check_id
      ])
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          if (
            rows[0].status === "2" ||
            rows[0].status === "4" ||
            rows[0].status === "7"
          )
            db1.query("UPDATE questions set is_read=1 where id=?", [
              criteria.question_id
            ]);
          return { status: 1, msg: rows[0] };
        } else {
          return { status: -1, msg: "沒有符合的提問紀錄" };
        }
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  getQuestions: async (partner_uid, server_id) => {
    return await db2
      .promise()
      .query(
        "SELECT q.id,q.type,q.content,q.create_time, q.status,q.is_read FROM questions  q WHERE  q.partner_uid=? and q.server_id=? order by id desc ",
        [partner_uid, server_id]
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return { status: 1, msg: rows };
        } else {
          return { status: -1, msg: "沒有符合的提問紀錄" };
        }
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  getRepliesByQID: async question_id => {
    return await db2
      .promise()
      .query(
        "select id,content,create_time,is_official  from question_replies where question_id=? order by id asc",
        [question_id]
      )
      .then(([rows, fields]) => {
        return { status: 1, msg: rows };
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  getPicplusByQID: async question_id => {
    return await db2
      .promise()
      .query(
        "select id,question_id,reply_id,pic_path  from question_pictures where question_id=? order by id asc",
        [question_id]
      )
      .then(([rows, fields]) => {
        return { status: 1, msg: rows };
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  checkRepeactReplies: async question_id => {
    return await db2
      .promise()
      .query(
        "SELECT count(*) > (3-1) as chk FROM question_replies WHERE question_id=? and create_time > date_sub(now(), INTERVAL 1 MINUTE)",
        question_id
      )
      .then(([rows, fields]) => {
        return { status: 1, msg: rows };
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  createQuestion: async (questionObject, add_pics) => {
    return await db1
      .promise()
      .query("INSERT questions set ?", questionObject)
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          for (let cnt = 0; cnt < add_pics.length; cnt++) {
            db1.query(
              "INSERT question_pictures set ?",
              {
                question_id: rows.insertId,
                pic_path: add_pics[cnt]
              },
              (err, result) => {
                if (err) throw err;
              }
            );

            //console.log("query", query);
          }
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
  insertReply: async (replyObject, add_pics) => {
    return await db1
      .promise()
      .query("INSERT question_replies set?", replyObject)
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          for (let cnt = 0; cnt < add_pics.length; cnt++) {
            db1.query(
              "INSERT question_pictures set ?",
              {
                question_id: replyObject.question_id,
                reply_id: rows.insertId,
                pic_path: add_pics[cnt]
              },
              (err, result) => {
                if (err) throw err;
              }
            );

            //console.log("query", query);
          }
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
  openQuestion: async q_id => {
    return await db1
      .promise()
      .query("UPDATE questions set is_read=0, status=1 where id=?", [q_id])
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          return { status: 1, msg: "修改成功" };
        } else {
          return { status: -1, msg: "修改失敗" };
        }
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  closeQuestion: async q_id => {
    return await db1
      .promise()
      .query(
        "UPDATE questions set close_admin_uid=null,system_closed_start=null, status=4 where id=?",
        [q_id]
      )
      .then(([rows, fields]) => {
        if (rows.affectedRows > 0) {
          return { status: 1, msg: "修改成功" };
        } else {
          return { status: -1, msg: "修改失敗" };
        }
      })
      .catch(err => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  }
};

module.exports = ServiceModel;
