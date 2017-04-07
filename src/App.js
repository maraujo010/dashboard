import React, { Component } from 'react';
import DataManager from './dataManager.js';
import SocketComm from './socketComm.js';
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
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
