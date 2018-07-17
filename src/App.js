import React, {Component} from "react";
import Header from "./Header.js";
import Footer from "./Footer.js";
import CoffeeApp from "./CoffeeApp"


class App extends Component {

    render() {
        return (
            <div>
              <Header />
                <CoffeeApp />
                <Footer />
            </div>
        )}}

export default App;
