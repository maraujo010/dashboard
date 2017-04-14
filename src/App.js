import React, { Component } from 'react';
import Map from './components/Map.js';
import Chart from './components/Chart.js';
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

    this.socket.onmessage = function(event) {
      //console.log(event.data);
      var dataset = JSON.parse(event.data);

      _self.dataManager.saveDataset(dataset);
      _self.mapMethods.addMarker(dataset);
      _self.chartMethods.update();
    }

  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Dashboard</h2>
        </div>
        <div className="App-content">
          <Chart dataManager={this.dataManager} ref={(chartMethods) => { this.chartMethods = chartMethods; }} />
          <Map dataManager={this.dataManager} ref={(mapMethods) => { this.mapMethods = mapMethods; }} />
        </div>
      </div>
    );
  }
}

export default App;
