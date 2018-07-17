import React, { Component } from "react";
import "./App.css";
import Coffee from "./assets/coffee-solid.svg";




class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <img src={Coffee} className="logo" alt="coffee cup logo"/>
        <h2>Made with love, Foursquare, and a nice flat white</h2>
        <img src={Coffee} className="logo" alt="coffee cup logo"/>
      </div>
    );
  }
}

export default Footer;
