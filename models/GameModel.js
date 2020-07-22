const { db1, db2 } = require("./db_conn");

const GameModel = {
  getGames: async () => {
    return await db2
      .promise()
      .query(
        `select game_id, name as game_name,logo_path,tags,rank, fanpage,vendor_game_id, site, bg_path, slogan, title_path from games where is_active=1 order by field(game_id, 'g83tw','g78naxx2hmt','g66naxx2tw','g104naxx2tw','h55naxx2tw') desc`
      )
      .then(([rows, fields]) => ({ status: 1, msg: rows }))
      .catch((err) => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },

  getGameById: async (game_id) => {
    return await db2
      .promise()
      .query(
        `select game_id, name as game_name,logo_path,tags,rank, fanpage,vendor_game_id, site, bg_path, slogan, title_path from games where is_active=1 and game_id=?`,
        game_id
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return { status: 1, msg: rows[0] };
        } else {
          return { status: -1, msg: `沒有這筆遊戲資料( ID = ${game_id})` };
        }
      })
      .catch((err) => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },

  getServersByGameId: async (game_id) => {
    return await db2
      .promise()
      .query(
        `select server_id, name as server_name, address,server_status from servers where server_status='public' and game_id=?`,
        game_id
      )
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          return { status: 1, msg: rows };
        } else {
          return { status: -1, msg: `該遊戲沒有設置伺服器( ID = ${game_id})` };
        }
      })
      .catch((err) => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  getFaqByGameId: async (game_id) => {
    return await db2
      .promise()
      .query(
        `select faq.id,faq.start_time, title,content, type_id,priority
      from faq inner join faq_types on faq.id = faq_types.faq_id
      inner join faq_games on faq_games.faq_id=faq.id
      where game_id =?
      and priority >=1 and now() between start_time and end_time order by priority desc,start_time desc`,
        game_id
      )
      .then(([rows, fields]) => {
        return { status: 1, msg: rows };
      })
      .catch((err) => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
  getServersByGameIdAndAddress: async (game_id, address) => {
    return await db2
      .promise()
      .query(
        `select server_id, name as server_name, address from servers where  game_id=? and address=?`,
        [game_id, address]
      )
      .then(([rows, fields]) => {
        //console.log(rows);
        if (rows.length > 0) {
          return rows[0];
        } else {
          return { server_id: address, server_name: address };
        }
      })
      .catch((err) => {
        //console.log(err);
        return { status: -1, msg: err.message };
      });
  },
};

module.exports = GameModel;
