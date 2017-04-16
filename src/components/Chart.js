import React, { Component } from 'react'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import D3Chart from './D3Chart.js'

class Chart extends Component {

  constructor() {
    super();

    this.state = {
      selectedTimeFrame: 6,
      timeFrame: 6,
      chartData: []
    }
  }

  componentWillMount() {

    var filteredDatasets = this.props.dataManager.filterLoadedDatasets(this.state.timeFrame);
    var chartData        = this.buildBarChartData(filteredDatasets);

    this.setState({
      selectedTimeFrame: 6,
      timeFrame: 6,
      chartData: chartData
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
    this.update();
  }

  // Update chart data
  update() {

    var filteredDatasets = this.props.dataManager.filterLoadedDatasets(this.state.timeFrame);
    var chartData        = this.buildBarChartData(filteredDatasets);

    this.setState({
      chartData: chartData,
      selectedTimeFrame: this.state.timeFrame
    });

  }

  // build chart data from filtered datasets
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

  render() {

    // slider

    const { timeFrame }          = this.state;

    const formatTime = function(value) {
      var label = "";

      if (value<24)
        label = value + ' hours';
      else {
        let nDays    = Math.trunc(value/24);
        let dayLabel = nDays > 1 ? ' days' : ' day';

        label = nDays + dayLabel;
      }

      return label
    }

    return (
      <div className="App-chart-area">
        <div id="TimeSlider">
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
        <div className='title'>Number of active drivers by company since last {formatTime(this.state.selectedTimeFrame)}</div>
        <div id="BarChart">
          <D3Chart chartData={this.state.chartData} />
        </div>
      </div>
    );
  }
}

export default Chart;
