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
    var _self = this;

    ws.onopen = function() {
      console.log('Connected to the server');
    }

    ws.onmessage = function(event) {
      //console.log(event.data);
      var dataset = JSON.parse(event.data);

      _self.dataManager.saveDataset(dataset);
      _self.mapMethods.addMarker(dataset);
      _self.updateCharts();

    }

    ws.onclose = function(){
       //try to reconnect in 10 seconds
       console.log("Disconnected form the server. Trying to reconnect...");
       setTimeout(function(){_self.startConnection(wsServerUrl)}, 10000);
   };

  }

  componentWillMount() {

    var filteredDatasets = this.dataManager.filterLoadedDatasets(this.state.timeFrame);
    var barChartData     = this.buildBarChartData(filteredDatasets);

    this.setState({
      selectedTimeFrame: 6,
      timeFrame: 6,
      barChartData: barChartData
    });
  }

  // build bar chart data from filtered datasets
  buildBarChartData(datasets) {

    var chartData = [],
        companys  = {},
        drivers   = [];

    for (let i=0; i<datasets.length; i++) {
      var key = datasets[i].company_id;

      if (companys.hasOwnProperty(key) && drivers.indexOf(datasets[i].driver_id))
        companys[key].NumDrivers++;
      else {
        companys[key] = {
          companyID: datasets[i].company_id,
          NumDrivers: 1
        };

        drivers.push(datasets[i].driver_id);
      }
    }

    for (let key in companys)
      if (companys.hasOwnProperty(key))
        chartData.push(companys[key]);

    return chartData;
  }

  // build bar chart data from filtered datasets
  buildBubbleChartData(datasets) {

    var chartData = [],
        companys  = {},
        drivers   = [];

    for (let i=0; i<datasets.length; i++) {
      var key = datasets[i].company_id;

      if (companys.hasOwnProperty(key) && drivers.indexOf(datasets[i].driver_id))
        companys[key].NumDrivers++;
      else {
        companys[key] = {
          companyID: datasets[i].company_id,
          NumDrivers: 1
        };

        drivers.push(datasets[i].driver_id);
      }
    }

    for (let key in companys)
      if (companys.hasOwnProperty(key))
        chartData.push(companys[key]);

    return chartData;
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

    var filteredDatasets = this.dataManager.filterLoadedDatasets(this.state.timeFrame);
    var barChartData     = this.buildBarChartData(filteredDatasets);
    var bubbleChartData  = this.buildBubbleChartData(filteredDatasets);

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
            <div className="barChart">
              <D3Chart chartData={this.state.barChartData} type="bars" />
            </div>
          </div>
          <div className="bubbleChart-area">
            <div className="title bubbleChartTitle">Active drivers in the last {formatTime(this.state.selectedTimeFrame)}</div>
            <div className="bubbleChart">
              <D3Chart chartData={this.state.bubbleChartData} type="bubbles" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
