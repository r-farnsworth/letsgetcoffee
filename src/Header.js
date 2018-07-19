import React, { Component } from "react";
import "./App.css";
import Coffee from "./assets/coffee-solid.svg";




  function Header() {
    return (
      <div className="header">
        <img src={Coffee} className="logo" alt="coffee cup logo"/>
        <h1>Let's Get Coffee!</h1>
        <img src={Coffee} className="logo" alt="coffee cup logo"/>
      </div>
    );
  }


export default Header;
