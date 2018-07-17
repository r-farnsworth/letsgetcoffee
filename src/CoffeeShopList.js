import React, {Component} from "react";
import CoffeeShop from "./CoffeeShop";


// this component contains everything I need for filtering the list
class CoffeeShopList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "locations": "",
            "query": "",
            "": true,
        };

        // bind so 'this' behaves correctly
        this.toggleList = this.toggleList.bind(this);
        this.filterLocations = this.filterLocations.bind(this);
    }

    // filter the entries based on user input
    filterLocations(event) {
        const {value} = event.target;
        let locations = [];
        this.props.coffeeShopLocations.forEach(function (location) {
            if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                locations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
            "locations": locations,
            "query": value
        });
    }

    componentWillMount() {
        this.setState({
            "locations": this.props.coffeeShopLocations
        });
    }


    toggleList() {
        this.setState({
            "list": !this.state.list
        });
    }


    render() {
        const CoffeeShopList = this.state.locations.map(function (listItem, index) {
            return (
                <CoffeeShop key={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={listItem}/>
            )},
        this);

        return (
            <div className="search">
                <input
                  role="search"
                  aria-labelledby="filter"
                  id="search-field"
                  className="search-field"
                  type="text"
                  placeholder="Search for coffee"
                  value={this.state.query}
                  // calls filterLocations when input is changed
                  onChange={this.filterLocations}/>
                <ul>
                    {this.state.list && CoffeeShopList}
                </ul>
                <button
                  className="button"
                  onClick={this.toggleList}>
                  Show/Hide List</button>
            </div>
        )}}

export default CoffeeShopList;
