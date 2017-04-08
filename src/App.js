import React, { Component } from 'react';
import Map from './components/Map.js';
import Graph from './components/Graph.js';
import DataManager from './DataManager.js';
import './App.css';

class App extends Component {

  render() {

    var dataManagerHelper = new DataManager();
    var socket            = new WebSocket('ws://localhost:8080/');

    socket.onopen = function() {
      console.log('Connected to the server');
    }

    socket.onmessage = function(event) {
      dataManagerHelper.SaveDataset(event.data)
    }

    return (
      <div className="App">
        <div className="App-header">
          <h2>Dashboard</h2>
        </div>
        <div className="App-content">
          <div className="App-graph-area"></div>
          <div className="App-map-area"><Map /></div>
        </div>
      </div>
    );
  }
}

export default App;
