const express = require("express");
const router = express.Router();
const GameModel = require("../../models/GameModel");

router.get("/test", (req, res) => {
  res.json({ msg: "Game API Route works" });
});

//@route: GET /api/games/get_games
//@desc: return all games
//@access: public
router.get("/get_games", (req, res) => {
  GameModel.getGames()
    .then((games) => {
      if (games.status === 1) {
        res.send(games);
      } else {
        res.status(400).send(games);
      }
    })
    .catch((err) => {
      return res.status(400).send({ status: -1, msg: err.message });
    });
});

//@route: GET /api/games/get_games
//@desc: return all games
//@access: public
router.get("/get_game/:game_id", (req, res) => {
  const game_id = req.params.game_id;
  GameModel.getGameById(game_id)
    .then((game) => {
      if (game.status === 1) {
        res.send(game);
      } else {
        res.status(400).send(game);
      }
    })
    .catch((err) => res.status(400).send({ status: -1, msg: err.message }));
});

//@route: GET /api/games/get_servers/:game_id
//@desc: return all servers base on its game_id
//@access: public
router.get("/get_servers/:game_id", (req, res) => {
  const game_id = req.params.game_id;
  GameModel.getServersByGameId(game_id)
    .then((game) => {
      if (game.status === 1) {
        res.send(game);
      } else {
        res.status(400).send(game);
      }
    })
    .catch((err) => res.status(400).send({ status: -1, msg: err.message }));
});

module.exports = router;
