import React, { Component } from 'react';
import Map from './components/Map.js';
import D3Chart from './components/D3Chart.js'
import DataManager from './DataManager.js';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import './Dashboard.css';

class Dashboard extends Component {

  constructor() {

    super();

    this.startConnection('ws://localhost:8080/');

    this.dataManager = new DataManager();

    this.state = {
      selectedTimeFrame: 6,
      timeFrame: 6,
      barChartData: [],
      bubbleChartData: []
    }

  }

  // connect to websockets server
  startConnection(wsServerUrl){

    var ws    = new WebSocket(wsServerUrl);

    ws.onopen = function() {
      console.log('Connected to the server');
    }

    ws.onmessage = (event) => {
      //console.log(event.data);
      var dataset = JSON.parse(event.data);

      this.dataManager.saveDataset(dataset);
      this.mapMethods.addMarker(dataset);
      this.updateCharts();
    }

    ws.onclose = () => {
       //try to reconnect in 10 seconds
       console.log("Disconnected form the server. Trying to reconnect...");
       setTimeout(() => {this.startConnection(wsServerUrl)}, 10000);
   };

  }

  componentWillMount() {

    var barChartData     = this.dataManager.buildBarChartData(6);
    var bubbleChartData  = this.dataManager.buildBubbleChartData(6);

    this.setState({
      selectedTimeFrame: 6,
      timeFrame: 6,
      barChartData: barChartData,
      bubbleChartData: bubbleChartData
    });
  }

  //  handle slider event onChange
  handleOnChange = (value) => {
    this.setState({
      timeFrame: value
    })
  }

  // handle slider event onChangeComplete
  handleOnChangeComplete = (value) => {
    this.updateCharts();
  }

  // Update chart data
  updateCharts() {

    var barChartData     = this.dataManager.buildBarChartData(this.state.timeFrame);
    var bubbleChartData  = this.dataManager.buildBubbleChartData(this.state.timeFrame);

    this.setState({
      barChartData: barChartData,
      bubbleChartData: bubbleChartData,
      selectedTimeFrame: this.state.timeFrame
    });

  }

  componentDidMount() {

    var _self = this;

    // purge datasets older than 10 days
    var int = setInterval(function(){

      try {
         _self.dataManager.loadedDatasets = _self.dataManager.purgeStoredData();
         _self.mapMethods.update();
         _self.updateCharts();

        console.log("purging...");
      }
      catch(err) {
        console.log(err.message);
        clearInterval(int);
      }
    }, 1000*60); // 10min interval 1000*60*10

  }

  render() {

    // slider
    const { timeFrame }  = this.state;
    const formatTime     = function(value) {
      var label = "";

      if (value<24)
        label = value + ' hours';
      else {
        let nDays = Math.trunc(value/24);
        label = nDays > 1 ? nDays + ' days' : '24 hours';
      }

      return label
    }

    return (
      <div className="app">
        <div className="app-header">
          <h2>Dashboard</h2>
        </div>
        <div className="app-content">
          <div className="slider-area">
            <div className="slider">
              <Slider
                min={6}
                max={240}
                step={24}
                value={timeFrame}
                orientation="horizontal"
                format={formatTime}
                tooltip={true}
                onChange={this.handleOnChange}
                onChangeComplete={this.handleOnChangeComplete} />
            </div>
          </div>
          <div className="map-area">
            <Map dataManager={this.dataManager} ref={(mapMethods) => { this.mapMethods = mapMethods; }} />
          </div>
          <div className="barChart-area">
            <div className="title">Number of active drivers by company in the last {formatTime(this.state.selectedTimeFrame)}</div>
            <D3Chart chartData={this.state.barChartData} type="bars" width={600} height={390} />
          </div>
          <div className="bubbleChart-area">
            <div className="title bubbleChartTitle">Active drivers in the last {formatTime(this.state.selectedTimeFrame)}</div>
            <D3Chart chartData={this.state.bubbleChartData} type="bubbles" width={600} height={400} />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
