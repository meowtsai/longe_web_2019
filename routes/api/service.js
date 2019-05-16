const express = require("express");
const router = express.Router();
var jwt = require("jsonwebtoken");
const md5 = require("md5");
const auth_for_create = require("../../middleware/auth_for_create");
const SERVICE_CONFIG = require("../../config/service");
const ServiceModel = require("../../models/ServiceModel");
const GameModel = require("../../models/GameModel");
const CharacterModel = require("../../models/CharacterModel");

router.get("/test", (req, res) => {
  res.json({ msg: "Service API Route works" });
});

router.get("/question_types", (req, res) => {
  const types = SERVICE_CONFIG.question_types;
  res.json({ status: 1, msg: types });
});

//@route: POST /api/question/by_checkid
//@desc: get a question by email,phone, checkid
//@access: public

router.post("/init_setup", auth_for_create, (req, res) => {
  const searchArray = req.body.search_string.replace("?", "").split("&");
  let searchObject = {};
  //console.log("init_setup searchArray", searchArray.length);
  //console.log("init_setup user", req.user);
  if (searchArray.length === 1 && req.user) {
    res.json({
      token: req.header("x-auth-token"),
      is_in_game: true,
      unread_count: 0
    });
    return;
  }

  for (let index = 0; index < searchArray.length; index++) {
    const element = searchArray[index].split("=");
    searchObject[element[0]] = element[1];
  }

  let {
    game_id,
    partner_uid,
    in_game_id,
    server_name,
    character_name,
    level,
    usr_device,
    os_ver,
    app_ver,
    time_zone,
    network,
    key
  } = searchObject;
  const is_in_game = validate_params(searchObject);

  if (is_in_game) {
    let userObj = {
      vendor_game_id: game_id,
      partner_uid,
      in_game_id,
      server_name,
      character_name,
      q_note: `等級=${level}, 系統=${usr_device}, os=${os_ver}, app_ver=${app_ver},time_zone=${time_zone},network=${network}`,
      is_in_game
    };

    GameModel.getServersByGameIdAndAddress(game_id, server_name).then(
      server_info => {
        userObj.server_info = server_info;

        CharacterModel.getCharInfoByInGameId(server_info.server_id, in_game_id)
          .then(char => {
            console.log("char", char);
            if (char.status == 1) {
              if (char.msg.name !== character_name) {
                CharacterModel.update_character(char.msg.id, character_name);
              }
            } else {
              let character_info = {
                uid: 0,
                partner_uid,
                name: character_name,
                in_game_id,
                server_id: server_info.server_id,
                create_status: 0,
                ad: ""
              };
              //console.log(character_info);
              CharacterModel.create_character(character_info);
            }

            return ServiceModel.getUnreadByUID(partner_uid);
          })
          .then(unread_result => {
            userObj.unread_count = unread_result.cnt;
            console.log(userObj);

            jwt.sign(
              userObj,
              SERVICE_CONFIG.jwt_encryption,
              {
                expiresIn: "1d"
              },
              (err, token) => {
                //console.log(token);
                if (err) throw err;
                res.json({
                  token,
                  is_in_game,
                  unread_count: userObj.unread_count
                });
              }
            );
          });
      }
    );
  } else {
    res.json({ is_in_game });
  }
});

function validate_params(searchObject) {
  let {
    game_id,
    partner_uid,
    in_game_id,
    server_name,
    character_name,
    level,
    usr_device,
    os_ver,
    app_ver,
    time_zone,
    network,
    key
  } = searchObject;
  const game_key = SERVICE_CONFIG.question_key[game_id];
  let encode_server_name = encodeURI(server_name);
  let encode_c_name = url_encode(character_name);

  os_ver = os_ver ? encodeURI(os_ver) : "";
  level = level ? level : "";
  network = network ? network : "";
  let str_to_encrypt = `game_id=${game_id}&partner_uid=${partner_uid}&in_game_id=${in_game_id}&server_name=${encode_server_name}&character_name=${encode_c_name}&level=${level}&usr_device=${usr_device}&os_ver=${os_ver}&app_ver=${app_ver}&network=${network}&key=${game_key}`;
  let sig = md5(str_to_encrypt);

  if (key !== sig) {
    str_to_encrypt = "";
    for (var jkey in searchObject) {
      if (searchObject.hasOwnProperty(jkey) && jkey !== "key") {
        //console.log(jkey + ": " + req.body[jkey]);
        str_to_encrypt += `${jkey}=${url_encode(searchObject[jkey])}&`;
      }
    }

    sig = md5(`${str_to_encrypt}key=${game_key}`);
  }

  //console.log("str_to_encrypt", str_to_encrypt);
  //console.log("sig", sig);
  //res.json({ str_to_encrypt, sig });
  if (key === sig) {
    return true;
  } else {
    return false;
  }
}
function url_encode(url) {
  url = encodeURIComponent(url);
  url = url.replace("~", escape("~"));
  // # % { } | \ ^ ~ [ ] `<>
  // url = url.replace(/\%3A/g, ":");
  // url = url.replace(/\%2F/g, "/");
  // url = url.replace(/\%3F/g, "?");
  // url = url.replace(/\%3D/g, "=");
  // url = url.replace(/\%26/g, "&");

  return url;
}
module.exports = router;
