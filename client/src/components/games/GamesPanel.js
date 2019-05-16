import React, { Component } from "react";
import GameBox from "./GameBox";

class GamesPanel extends Component {
  render() {
    const { games } = this.props;
    let boxContent;
    if (games.length === 0) {
      boxContent = null;
    } else {
      boxContent = games.map(game => (
        <GameBox key={game.game_id} game={game} />
      ));

      //console.log("gamesMenu", gamesMenu);
    }
    return (
      <div className="game_container">
        <div className="game_title">所有遊戲</div>
        <div className="allgame_list">{boxContent}</div>
      </div>
    );
  }
}

export default GamesPanel;
