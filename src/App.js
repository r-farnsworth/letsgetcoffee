import React, {Component} from "react";
import Header from "./Header.js";
import Footer from "./Footer.js";
import CoffeeApp from "./CoffeeApp"


class App extends Component {
// the only thing a component MUST have is a render method
    render() {
        return (
            <div className="App">
              <Header />
              <CoffeeApp />
              <Footer />
            </div>
        )}}

export default App;
