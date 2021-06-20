import React, { Component } from "react";
import { Link } from "react-router-dom";
import isEmpty from "../../validation/is-empty";

class Navbar extends Component {
  render() {
    const { games } = this.props;
    //console.log("games", games);

    let gamesMenu;
    if (games.length === 0) {
      gamesMenu = null;
    } else {
      gamesMenu = games
        .filter((game) => !isEmpty(game.site))
        .map((game) => (
          <a key={game.game_id} className="dropdown-item" href={game.site}>
            {game.game_name}
          </a>
        ));

      //console.log("gamesMenu", gamesMenu);
    }
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <div className="nav_logo" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul
              className="navbar-nav ml-auto"
              style={{ fontFamily: "Microsoft JhengHei" }}
            >
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  首頁
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/support" className="nav-link">
                  客服
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  href="!#"
                >
                  遊戲
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {gamesMenu}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
