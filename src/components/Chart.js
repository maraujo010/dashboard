import React, { Component } from 'react';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import BarChart from './BarChart.js'
class Chart extends Component {

  constructor() {

    super();

    this.state = {
      timeFrame: 6,
      chartData: []
    }

  }

  componentWillMount() {

    var filteredDatasets = this.props.dataManager.filterLoadedDatasets(this.state.timeFrame);
    var chartData        = this.buildChartData(filteredDatasets);

    this.setState({
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

  // build chart data from filtered datasets
  buildChartData(datasets) {

    var chartData    = [],
        dataHashing  = {};

    for (let i=0; i<datasets.length; i++) {
      var key = "" + datasets[i].company_id + datasets[i].driver_id;

      if (dataHashing.hasOwnProperty(key))
        dataHashing[key].NSentDatasets++;
      else {
        dataHashing[key] = { companyID     : datasets[i].company_id,
                            driverID      : datasets[i].driver_id,
                            NSentDatasets : 1 };
                          }
    }

    for (let key in dataHashing)
      if (dataHashing.hasOwnProperty(key))
        chartData.push(dataHashing[key]);

console.log(chartData);
    return chartData;

  }

  // handle slider event onChangeComplete
  handleOnChangeComplete = (value) => {

    var filteredDatasets = this.props.dataManager.filterLoadedDatasets(this.state.timeFrame);
    var chartData        = this.buildChartData(filteredDatasets);

    this.setState({
      chartData: chartData
    });

  }


  render() {

    // slider

    const { timeFrame }  = this.state
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
          <div className='value'>{formatTime(timeFrame)}</div>
        </div>
        <div id="BarChart">
          <BarChart chartData={this.state.chartData} />
        </div>
      </div>
    );
  }
}

export default Chart;
