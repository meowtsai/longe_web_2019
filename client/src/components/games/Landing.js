import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import GamesSwiper from "./GamesSwiper";
import GamesPanel from "./GamesPanel";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getGames } from "../../actions/gameActions";
import isEmpty from "../../validation/is-empty";

class Landing extends Component {
  componentDidMount() {
    this.props.getGames();
  }
  render() {
    const { games } = this.props;
    const gameSlides = games.filter(
      (game) => game.tags?.indexOf("首頁輪播") > -1
    );
    const gameDisplay = games.filter((game) => !isEmpty(game.site));
    return (
      <div>
        <Navbar games={games} />
        <GamesSwiper games={gameSlides} />
        <GamesPanel games={gameDisplay} />

        <Footer />
      </div>
    );
  }
}

Landing.propTypes = {
  getGames: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  games: state.games.games,
});

export default connect(mapStateToProps, { getGames })(Landing);
