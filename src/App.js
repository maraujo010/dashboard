import React, { Component } from 'react';
import Map from './components/Map.js';
import Graph from './components/Graph.js';
import DataManager from './DataManager.js';
import SocketComm from './SocketComm.js';
import './App.css';

class App extends Component {

  render() {

    var dataManagerObj = new DataManager();
    var comm           = new SocketComm(dataManagerObj);

    comm.CreateConn();

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
