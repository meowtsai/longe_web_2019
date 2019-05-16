const mysql = require("mysql2");
const CONFIG = require("../config/config")[process.env.NODE_ENV];

// create the connection to database
const db1 = mysql.createPool({
  host: CONFIG.db_host1,
  user: CONFIG.db_user,
  database: CONFIG.db_database,
  password: CONFIG.db_password,
  port: CONFIG.db_port,
  charset: "UTF8_GENERAL_CI"
});

const db2 = mysql.createPool({
  host: CONFIG.db_host2,
  user: CONFIG.db_user,
  database: CONFIG.db_database,
  password: CONFIG.db_password,
  port: CONFIG.db_port,
  charset: "UTF8_GENERAL_CI"
});

module.exports = { db1, db2 };
