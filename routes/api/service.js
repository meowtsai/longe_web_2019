const express = require("express");
const router = express.Router();
var jwt = require("jsonwebtoken");
const md5 = require("md5");
const auth_for_create = require("../../middleware/auth_for_create");
const SERVICE_CONFIG = require("../../config/service");
const ServiceModel = require("../../models/ServiceModel");
const GameModel = require("../../models/GameModel");
const CharacterModel = require("../../models/CharacterModel");

router.get("/test", async (req, res) => {
  res.json({ status: 1, msg: "works" });
});

router.get("/question_types", (req, res) => {
  const types = SERVICE_CONFIG.question_types;
  res.json({ status: 1, msg: types });
});

//@route: POST /api/question/by_checkid
//@desc: get a question by email,phone, checkid
//@access: public

router.post("/init_setup", auth_for_create, async (req, res) => {
  const searchArray = req.body.search_string.replace("?", "").split("&");
  let searchObject = {};
  //console.log("init_setup searchArray length", searchArray.length);
  //console.log("req.user auth", req.user);

  if (searchArray.length === 1 && req.user) {
    const isWhale2 = await CharacterModel.is_whale(
      req.user.partner_uid,
      req.user.vendor_game_id
    );

    let showInvitation2 = false;

    if (SERVICE_CONFIG.vip_invite_settings[req.user.vendor_game_id]) {
      showInvitation2 =
        (SERVICE_CONFIG.vip_invite_settings[req.user.vendor_game_id]
          .line_invite_public
          ? true
          : req.whitelisted) && isWhale2
          ? true
          : false;
    }

    // const showInvitation2 =
    //   req.user.vendor_game_id === 'g66naxx2tw' &&
    //   (SERVICE_CONFIG.line_invite_public ? truSERVICE_CONFIG.vip_invite_settings[req.user.vendor_game_id]e : req.whitelisted) &&
    //   isWhale2
    //     ? true
    //     : false;
    const game = await GameModel.getGameById(req.user.vendor_game_id);
    ServiceModel.getUnreadByUID(req.user.partner_uid)
      .then((unread_result) => {
        res.json({
          token: req.header("x-auth-token"),
          is_in_game: true,
          unread_count: unread_result.cnt,
          game_id: req.user.vendor_game_id,
          game_name: game.msg.game_name,
          showInvitation: showInvitation2,
          line_invite_link: showInvitation2
            ? SERVICE_CONFIG.line_invite_link
            : null,
        });
        return;
      })
      .catch((err) => {
        res.status(400).json(err.message);
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
    key,
    param_game_id,
  } = searchObject;
  const is_in_game = validate_params(searchObject);
  const game_info = await GameModel.getGameById(
    game_id ? game_id : param_game_id
  );
  //
  //console.log("is_in_game", is_in_game);
  if (is_in_game) {
    let userObj = {
      vendor_game_id: game_id,
      partner_uid,
      in_game_id,
      server_name,
      character_name,
      q_note: `等級=${level}, 系統=${usr_device}, os=${os_ver}, app_ver=${app_ver},time_zone=${time_zone},network=${network}`,
      is_in_game,
    };

    const server_info = await GameModel.getServersByGameIdAndAddress(
      game_id,
      server_name
    );
    userObj.server_info = server_info;

    const char = await CharacterModel.getCharInfoByInGameId(
      server_info.server_id,
      in_game_id
    );
    if (char.status == 1) {
      if (char.msg.name !== character_name) {
        CharacterModel.update_character(char.msg.id, character_name).catch(
          (err) => {
            //console.log("update_character", err.message);
            throw err;
          }
        );
      }
    } else {
      let character_info = {
        uid: 0,
        partner_uid,
        name: character_name,
        in_game_id,
        server_id: server_info.server_id,
        create_status: 0,
        ad: "",
      };
      //console.log("character_info", character_info);
      CharacterModel.create_character(character_info).catch((err) => {
        //console.log("create_character", err.message);
        throw err;
      });
    }
    const unread_result = await ServiceModel.getUnreadByUID(partner_uid);
    userObj.unread_count = unread_result.cnt;
    const token = jwt.sign(userObj, SERVICE_CONFIG.jwt_encryption, {
      expiresIn: "1d",
    });

    //
    const isWhale = await CharacterModel.is_whale(partner_uid, game_id);
    // console.log('isWhale', partner_uid, game_id, isWhale);
    // console.log(SERVICE_CONFIG.vip_invite_settings[game_id]);
    let showInvitation = false;

    const vip_invite_settings = SERVICE_CONFIG.vip_invite_settings[game_id];

    //0421 vip invitation config
    if (vip_invite_settings) {
      showInvitation =
        (vip_invite_settings.line_invite_public ? true : req.whitelisted) &&
        isWhale
          ? true
          : false;
    }

    // const showInvitation =
    //   game_id === 'g66naxx2tw' &&
    //   (SERVICE_CONFIG.line_invite_public ? true : req.whitelisted) &&
    //   isWhale
    //     ? true
    //     : false;

    res.json({
      token,
      is_in_game,
      game_id,
      game_name: game_info.msg.game_name,
      unread_count: userObj.unread_count,
      isWhitelisted: req.whitelisted,
      showInvitation,
      line_invite_link: showInvitation
        ? vip_invite_settings.line_invite_link
        : null,
    });
  } else {
    res.json({
      is_in_game,
      isWhitelisted: req.whitelisted,
      game_name: game_info.msg.game_name,
    });
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
    key,
  } = searchObject;
  if (in_game_id === "0") {
    return false;
  }
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
