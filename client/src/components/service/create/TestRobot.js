import React, { Component } from "react";

import { ReCaptcha } from "react-recaptcha-google";
export default class TestRobot extends Component {
  onChange = value => {
    console.log("Captcha value:", value);
  };

  render() {
    return (
      <div>
        <ReCaptcha
          sitekey="6LefP6UUAAAAAA0qZDJrLhODhk6vP0X6Gx--zbQ1"
          onChange={this.onChange}
        />
      </div>
    );
  }
}
