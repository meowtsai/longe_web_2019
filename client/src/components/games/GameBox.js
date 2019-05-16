import React, { Component } from "react";
import isEmpty from "../../validation/is-empty";
class GameBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title_class: "img_title_horizontal"
    };
  }

  onClick(url) {
    window.location.href = url;
  }
  render() {
    const { title_class } = this.state;
    const { game } = this.props;

    const img = (
      <img
        src={game.title_path}
        alt={game.slogan}
        onLoad={e =>
          e.target.naturalWidth < e.target.naturalHeight
            ? this.setState({ title_class: "img_title_straight" })
            : this.setState({ title_class: "img_title_horizontal" })
        }
        style={{ display: "none" }}
      />
    );

    return (
      <div>
        {img}
        <div
          style={{ cursor: "pointer" }}
          onClick={this.onClick.bind(this, game.site)}
        >
          <div className="allgamebox">
            <div
              className="allgames_img"
              style={{ backgroundImage: `url(${game.bg_path})` }}
            >
              <div
                className={title_class}
                style={{ backgroundImage: `url(${game.title_path})` }}
              />
            </div>
            <span>{game.name}</span>
            <div className="box_detail">
              <a href={game.site} target="_blank" rel="noopener noreferrer">
                <div className="allgame_home">前往官網</div>
              </a>
              {!isEmpty(game.fanpage) && (
                <a
                  href={game.fanpage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="allgame_fb">facebook</div>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default GameBox;
