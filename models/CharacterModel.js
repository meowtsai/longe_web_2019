const { db1, db2 } = require("./db_conn");

const CharacterModel = {
  getCharInfoByInGameId: async (server_id, in_game_id) => {
    // console.log("server_id", server_id);
    // console.log("in_game_id", in_game_id);

    return await db2
      .promise()
      .query(
        "select id,name from characters where server_id=? and in_game_id=?",
        [server_id, in_game_id]
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return { status: 1, msg: rows[0] };
        } else {
          return { status: -1, msg: {} };
        }
      });
  },
  create_character: async char_info => {
    return await db1
      .promise()
      .query("INSERT INTO characters SET ?", char_info)
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
  update_character: async (c_id, c_name) => {
    return await db1
      .promise()
      .query("UPDATE characters SET name=? WHERE id= ?", [c_name, c_id])
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

module.exports = CharacterModel;
