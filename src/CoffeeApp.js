import React, {Component} from "react";
import CoffeeShopList from "./CoffeeShopList";
import * as coffeeShops from "./CoffeeShops.json";
import MapStyles from "./MapStyles.js";

// in case there's an authentication error on google maps
// https://developers.google.com/maps/documentation/javascript/events#auth-errors
window.gm_authFailure = () => {
  window.gm_authFailure = this.gm_authFailure;
  const mapDiv = document.querySelector("#map");
  mapDiv.innerHTML = "<h2>Google Maps authentication error</h2>";
}

class CoffeeApp extends Component {

    constructor(props) {
      //always need to set super on a constructor function
        super(props);
        this.state = {

            "infoWindow": "",
            // load up the array of locations from the JSON file
            "coffeeShopLocations": coffeeShops
        };

        // need to use bindings so that 'this' is correctly used inside functions (https://medium.freecodecamp.org/react-binding-patterns-5-approaches-for-handling-this-92c651b5af56)
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);

    }


    componentDidMount() {
        // wait until the component has loaded, then invoke initMap()
        window.initMap = this.initMap;
        // store my API key in a variable. I think this makes the code more easily updatable.
        const myAPIkey = "AIzaSyBKMWcVdV8GszbYDYDuMao5nbgll0adKcA";
        // load Google Maps with my key - notice that initMap() is passed in as a callback
        loadMap(`https://maps.googleapis.com/maps/api/js?key=${myAPIkey}&callback=initMap`)
    }



    // render the map once the component is loaded
    initMap() {
        const self = this;



        const mapArea = document.getElementById('map');
        const map = new window.google.maps.Map(mapArea, {
            center: {lat: 51.7593117, lng: -1.2108251},
            zoom: 16,
            styles: MapStyles
        });

        // infoWindow
        const InfoWindow = new window.google.maps.InfoWindow({});
        //event handler for closing the info window
        window.google.maps.event.addListener(InfoWindow, "closeclick", function () {
            self.closeInfoWindow();
        });

        this.setState({
            "map": map,
            "infowindow": InfoWindow
        });

        window.google.maps.event.addListener(window, "resize", function () {
            const center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });



        // get the locations of the coffee! start with an empty array...
        const coffeeShopLocations = [];
        //set the state for each marker passing in the location as the argument
        this.state.coffeeShopLocations.forEach(function (location) {
          // shopName necessary for geocoding and for the filter list
            let shopName = location.name;
            let marker = new window.google.maps.Marker({
                map: map,
                position: new window.google.maps.LatLng(location.position),
                animation: window.google.maps.Animation.DROP
            });

            marker.addListener("click", function () {
                self.openInfoWindow(marker);
            });

            location.shopName = shopName;
            location.marker = marker;
            location.display = true;
            coffeeShopLocations.push(location);
        });

        // set the state for the coffee locations
        this.setState({
            "coffeeShopLocations": coffeeShopLocations
        })};

    // openWindow marker information

    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            "prevMarker": marker
        });

        this.getCoffeeDetails(marker);
      }


     // fetch details of the coffee shop from the foursquare API using url, and display it inside the marker modal
    getCoffeeDetails(marker) {
        const self = this;
        const clientID = "JDXWAZX2KTQF4QROKYSWXJDJNNPGLGPR5TIG02SLNNGNZXGQ";
        const clientSecret = "HMTE5AG2EXTUT2LK5DKGNE2T5OZSWTMPLQ31F04YC1QIP4EH";

    // I think I've done this completely differently to everyone I've talked to but
    // I think it is better to set the clientID and clientSecret as variables as well as the URL. I just feel
    // like it makes the code cleaner, and if I needed to change my API credentials for whatever reason it would be
    // easier to do so than having one long URL.
        let url = `https://api.foursquare.com/v2/venues/search?client_id=
          ${clientID}
          &client_secret=${clientSecret}
          &v=20130815&ll=${marker.getPosition().lat()},
          ${marker.getPosition().lng()}&limit=1`;

        // send fetch, and it'll return a promise
        fetch(url)
            .then(
                function (response) {
                    // use the data sent by the FourSquare API to fill in the information
                    response.json().then(function (data) {
                      if (response.ok) {

                        let coffeeShop = data.response.venues[0];
                        let coffeeShopName = `<strong>${coffeeShop.name}</strong><br>`;
                        let coffeeShopAddress = `${coffeeShop.location.address}</br>`;
                        let fourSquare = `<a href="https://foursquare.com/v/${coffeeShop.id}"target="_blank">Go to FourSquare</a>`
                        self.state.infowindow.setContent(coffeeShopName + coffeeShopAddress + fourSquare);
                      } else {
                        self.state.infowindow.setContent("Sorry; FourSquare could not be loaded at this time")
                      }
                    }
                  )})

                    // pick up any errors
                    // I initially passed in error as an argument but React warned about duplicate keys,
                    // so I thought I should change it.
                    .catch(err => {
                      this.setState({error:"Data cannot be loaded at this time", err});
                      self.state.infowindow.setContent("Data cannot be loaded; please check your network connection")
                    })};



    closeInfoWindow() {
        if (this.state.prevMarker) {
            this.state.prevMarker.setAnimation(null);
        }
        this.setState({
            "prevMarker": ""
        });
        this.state.infowindow.close();
    }



    // finally, render the UI
    render() {
        return (
            <main className="main-area">

                <CoffeeShopList key="coffee-shop-map"
                  coffeeShopLocations={this.state.coffeeShopLocations}
                  openInfoWindow={this.openInfoWindow}
                  closeInfoWindow={this.closeInfoWindow}/>

                <div id="map"></div>

            </main>
        )}};

export default CoffeeApp;

// asynchronous request to load Google Maps
function loadMap(src) {
    const ref = window.document.getElementsByTagName("script")[0];
    const script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = () => {
        document.write("Error: Google Maps cannot be loaded at this time. Check your internet connection and try again.");
    };
    ref.parentNode.insertBefore(script, ref);
}
