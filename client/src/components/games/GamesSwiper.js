import React, { Component } from "react";
import Swiper from "react-id-swiper";
import { Pagination, Navigation } from "swiper/dist/js/swiper.esm";
import PropTypes from "prop-types";

class GamesSwiper extends Component {
  render() {
    const { games } = this.props;

    const params = {
      modules: [Pagination, Navigation],
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
        bulletClass: "s-bullet",
        bulletActiveClass: "s-bullet-active"
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      spaceBetween: 30
    };
    //console.log(games);
    let content;
    if (games.length > 0) {
      content = games.map(game => (
        <div key={game.game_id}>
          <div
            className="slidebg"
            style={{
              backgroundImage: `url(${game.bg_path})`
            }}
          >
            <div className="homebox homebox_black">
              <ul>
                <li>
                  <span className="gametitle">{game.game_name}</span>
                </li>
                <li>
                  <span className="gametext">{game.slogan}</span>
                </li>
                <li>
                  <a
                    href={game.site}
                    target="_blank"
                    className="homebutton"
                    rel="noopener noreferrer"
                  >
                    {" "}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ));
    }
    return <Swiper {...params}>{content}</Swiper>;
  }
}

GamesSwiper.propTypes = {
  games: PropTypes.array.isRequired
};
export default GamesSwiper;
