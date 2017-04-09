import React, { Component } from 'react';
import Map from './components/Map.js';
import Graph from './components/Graph.js';
import DataManager from './DataManager.js';
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.dataManager = new DataManager();
    this.socket      = new WebSocket('ws://localhost:8080/');

    var _self = this;

    this.socket.onopen = function() {

      console.log('Connected to the server');
    }

    // when a message arrives from the server...
    this.socket.onmessage = function(event) {
      //console.log(event.data);
      _self.dataManager.SaveDataset(event.data);

      var dataset = JSON.parse(event.data);
      _self.MapMethods.DrawMarker(dataset.longitude, dataset.latitude, dataset.driver_id);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Dashboard</h2>
        </div>
        <div className="App-content">
          <div className="App-graph-area"><Graph /></div>
          <div className="App-map-area"><Map dataManager={this.dataManager} ref={(MapMethods) => { this.MapMethods = MapMethods; }} /></div>
        </div>
      </div>
    );
  }
}

export default App;
