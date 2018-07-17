import React, {Component} from "react";

import CoffeeShopList from "./CoffeeShopList";

class CoffeeApp extends Component {
    constructor(props) {
        super(props);
        // set the state with the locations - I wonder if I could move this into a JSON file for scalability
        this.state = {
            "coffeeShopLocations": [
                {
                  "name": "Waitrose at Shell",
                  "position": {"lat": 51.7595132, "lng": -1.2148943},
                  "streetAddress": "63 London Road, Headington, OX3 7RD"
                },

                {
                  "name": "Caffe Nero",
                  "position": {"lat": 51.7601061, "lng": -1.2111104},
                  "streetAddress": "120 London Road, Headington, OX3 9AS"
                },

                {
                  "name": "Café Bonjour",
                  "position": {"lat": 51.760345, "lng": -1.2100827},
                  "streetAddress": "136 London Road, Headington, OX3 9EB"
                },

                {
                  "name": "La Croissanterie",
                  "position": {"lat": 51.7603962, "lng": -1.2110215},
                  "streetAddress": "3-5 Old High Street, Headington, OX3 9HP"
                },

                {
                  "name": "Jacobs & Field",
                  "position": {"lat": 51.7606492, "lng": -1.211289},
                  "streetAddress": "15 Old High Street, Headington, OX3 9HP"
                },



            ],
            // set the following as empty arrays so nothing appears when the page is first loaded
            "map": "",
            "infoWindow": "",
            "prevMarker": ""
        };

        // need to use bindings so that 'this' is correctly used inside functions (https://medium.freecodecamp.org/react-binding-patterns-5-approaches-for-handling-this-92c651b5af56)
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        // wait until the component has loaded, then invoke initMap()
        window.initMap = this.initMap;
        // load Google Maps with my key - notice that initMap() is passed in as a callback
        loadMap("https://maps.googleapis.com/maps/api/js?key=AIzaSyBKMWcVdV8GszbYDYDuMao5nbgll0adKcA&callback=initMap")
    }

    /**
     * Initialise the map once the google map script is loaded
     */
    initMap() {
        const self = this;

        const mapArea = document.getElementById('map');
        mapArea.style.height = window.innerHeight + "px";
        const map = new window.google.maps.Map(mapArea, {
            center: {lat: 51.7593117, lng: -1.2108251},
            zoom: 16.5,
            // mapTypeControl: false
        });

        // infoWindow
        const InfoWindow = new window.google.maps.InfoWindow({});
        //event handler for closing the info window
        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        this.setState({
            "map": map,
            "infowindow": InfoWindow
        });

        // window.google.maps.event.addDomListener(window, "resize", function () {
        //     var center = map.getCenter();
        //     window.google.maps.event.trigger(map, "resize");
        //     self.state.map.setCenter(center);
        // });

        // get the locations of the coffee!

        const coffeeShopLocations = [];
        //set the state for each marker passing in the location as the argument
        this.state.coffeeShopLocations.forEach(function (location) {
          // longname necessary for geocoding and for the filter list
            let longname = location.name;
            let marker = new window.google.maps.Marker({
                map: map,
                position: new window.google.maps.LatLng(location.position),
                animation: window.google.maps.Animation.DROP
            });

            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });

            location.longname = longname;
            location.marker = marker;
            location.display = true;
            coffeeShopLocations.push(location);
        });

        // set the state for the coffee locations
        this.setState({
            "coffeeShopLocations": coffeeShopLocations
        });
    }

    // openWindow marker information

    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });

        this.getCoffeeDetails(marker);
    }


     // fetch details of the coffee shop from the foursquare API, and display it inside the marker modal
    getCoffeeDetails(marker) {
        const self = this;
        const clientId = "JDXWAZX2KTQF4QROKYSWXJDJNNPGLGPR5TIG02SLNNGNZXGQ";
        const clientSecret = "HMTE5AG2EXTUT2LK5DKGNE2T5OZSWTMPLQ31F04YC1QIP4EH";
        let url = "https://api.foursquare.com/v2/venues/search?client_id=" +
          clientId + "&client_secret="
          + clientSecret + "&v=20130815&ll="
          + marker.getPosition().lat() + ","
          + marker.getPosition().lng() + "&limit=1";

        // send fetch, and it'll return a promise
        fetch(url)
            .then(
                function (response) {
                    if (!response.status) {
                        self.state.infowindow.setContent("Data cannot be loaded at this time");
                        return;
                    }

                    // use the data sent by the FourSquare API to fill in the information
                    response.json().then(function (data) {
                        let location_data = data.response.venues[0];

                        let coffeeShopName = `<b>${location_data.name}</b><br>`;
                        let fourSquare = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Go to FourSquare</a>'
                        self.state.infowindow.setContent(coffeeShopName + fourSquare);
                    })})

                    // pick up any errors
                    .catch(function (error) {
                      self.state.infowindow.setContent("Data cannot be loaded at this time");
                    })};


    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            "prevmarker": ""
        });
        this.state.infowindow.close();
    }

    // finally, render the UI
    render() {
        return (
            <div>

                <CoffeeShopList key="100" coffeeShopLocations={this.state.coffeeShopLocations} openInfoWindow={this.openInfoWindow}
                              closeInfoWindow={this.closeInfoWindow}/>
                <div id="map"></div>

            </div>
        )}}

export default CoffeeApp;

// asynchronous request to load Google Maps
function loadMap(src) {
    const ref = window.document.getElementsByTagName("script")[0];
    const script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onError = () => {
        document.write("Error: Google Maps cannot be loaded at this time. Check your internet connection and try again.");
    };
    ref.parentNode.insertBefore(script, ref);
}
