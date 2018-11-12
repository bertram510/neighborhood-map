import React, { Component } from 'react';
import './App.css';

import LocationList from './LocationList';
import Axios from 'axios';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            venues: [],
            locationList: [],
            map: '',
            infowindow: '',
            prevmarker: ''
        };

        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
  }

  componentDidMount() {
      this.getlocations();
  }

  renderMap() {
      loadMapScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDOWd9GvqrY7oRkIQQJRejtQvT7OZHn2nc&callback=initMap');
      window.initMap = this.initMap;
  }

  /**
   * Initialise the map once the google map script is loaded
   */
  initMap() {
      var self = this;

      var mapview = document.getElementById('map');
      mapview.style.height = window.innerHeight + "px";
      var map = new window.google.maps.Map(mapview, {
          center: {lat: 33.4514661, lng: -112.0826357},
          zoom: 14,
          mapTypeControl: false
      });

      var InfoWindow = new window.google.maps.InfoWindow({});

      window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
          self.closeInfoWindow();
      });

      this.setState({
          map: map,
          infowindow: InfoWindow
      });

      window.google.maps.event.addDomListener(window, "resize", function () {
          var center = map.getCenter();
          window.google.maps.event.trigger(map, "resize");
          self.state.map.setCenter(center);
      });

      window.google.maps.event.addListener(map, 'click', () => {
          this.closeInfoWindow();
      });

      const locationList = [];
      this.state.venues.forEach( (selectedVenue) => {
          const marker = new window.google.maps.Marker({
              position: new window.google.maps.LatLng(selectedVenue.venue.location.lat, selectedVenue.venue.location.lng),
              animation: window.google.maps.Animation.DROP,
              map: map
          });

          marker.addListener('click', () => {
              this.openInfoWindow(location);
          });

          const location = {
              name: selectedVenue.venue.name,
              marker: marker,
              venueData: selectedVenue.venue,
              display: true
          };
          locationList.push(location);
      });
      this.setState({
          locationList: locationList
      });
  }

  /**
   * Retrieve Recommended Locations using Foursquare API
   */
  getlocations() {
      const parameters = {
          client_id: "2LET4I3GUNOKITCAQSG1DOXZYQ5IWREPMYTWVAMM4JNIAOK1",
          client_secret: "AOQHTH4IUZTD4I0PEYLVHNXWIZP4ZS1544ZCE0A4XEIPAXD0",
          near: "Phoenix",
          v: "20180323"
      } 

      Axios.get("https://api.foursquare.com/v2/venues/explore?" + new URLSearchParams(parameters))
          .then((response) => { 
              this.setState({
                  // Get the first group of recommended list
                  venues: response.data.response.groups[0].items
              });
              this.renderMap();
              this.forceUpdate();
          })
          .catch((err) => { console.error(err); });
  }

  /**
   * Open the infowindow for the marker
   * @param {object} location marker
   */
  openInfoWindow(location) {
      this.closeInfoWindow();
      this.state.infowindow.open(this.state.map, location.marker);
      location.marker.setAnimation(window.google.maps.Animation.BOUNCE);
      this.setState({
          currentMarker: location.marker
      });
      this.state.map.setCenter(location.marker.getPosition());
      this.state.map.panBy(0, -200);
      this.setInfoWindowContents(location.venueData);
  }

  setInfoWindowContents(location_data) {
      const address = '<b>Address: </b>' + (location_data.location.formattedAddress ? location_data.location.formattedAddress.join(', ') : 'N/A') + '<br>';
      const checkinsCount = '<b>Number of CheckIn: </b>' + location_data.stats.checkinsCount + '<br>';
      const name = '<b>Name: </b>' + (location_data.name ? location_data.name : 'N/A') + '<br>';
      const verifiedLocation = '<b>Verified Location: </b>' + (location_data.verified ? 'Yes' : 'No') + '<br>';
      const readMore = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More on Foursquare Website</a>'
      this.state.infowindow.setContent( name + verifiedLocation + address + checkinsCount + readMore);
  }

  /**
   * Close the infowindow for the marker
   * @param {object} location marker
   */
  closeInfoWindow() {
      if (this.state.currentMarker) {
          this.state.currentMarker.setAnimation(null);
      }
      this.setState({
          currentMarker: ''
      });
      this.state.infowindow.close();
  }

  render() {
      return (
          <div>
              <LocationList key="1" locationList={this.state.locationList} openInfoWindow={this.openInfoWindow}
                            closeInfoWindow={this.closeInfoWindow}/>
              <div id="map"></div>
          </div>
      );
  }
}

export default App;


/**
 * Load the google maps Asynchronously
 * @param {url} url of the google maps script
 */
function loadMapScript(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function () {
      document.write("Google Maps can't be loaded");
  };
  ref.parentNode.insertBefore(script, ref);
}
