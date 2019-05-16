import React, { Component } from "react";
import { Link } from "react-router-dom";
class CSBox extends Component {
  render() {
    const { game } = this.props;
    return (
      <Link to={`/service/${game.game_id}`}>
        <div className="cs_box" style={{ boxSizing: "content-box" }}>
          <img src={game.logo_path} alt="" />
          <span>{game.game_name}</span>{" "}
        </div>
      </Link>
    );
  }
}

export default CSBox;
