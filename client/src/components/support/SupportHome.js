import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import isEmpty from "../../validation/is-empty";

import Navbar from "../games/Navbar";
import Footer from "../games/Footer";
import CSBox from "./CSBox";
import { getGames } from "../../actions/gameActions";

class SupportHome extends Component {
  componentDidMount() {
    this.props.getGames();
  }
  render() {
    const { games } = this.props;
    let boxContent;
    if (games.length === 0) {
      boxContent = null;
    } else {
      boxContent = games
        .filter(game => !isEmpty(game.site))
        .map(game => <CSBox key={game.game_id} game={game} />);

      //console.log("gamesMenu", gamesMenu);
    }
    return (
      <div>
        <Navbar games={games} />
        <div id="customer_content_outer" style={{ marginBottom: "150px" }}>
          <div id="customer_banner" style={{ marginTop: "0" }}>
            <div className="banner_fix">
              <div
                className="cs_title"
                style={{ marginBottom: "15px", color: "white" }}
              >
                客服中心
              </div>
            </div>
          </div>

          <div className="customer_container">
            <div id="cs_box_outer">{boxContent}</div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

SupportHome.propTypes = {
  getGames: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  games: state.games.games
});

export default connect(
  mapStateToProps,
  { getGames }
)(SupportHome);
