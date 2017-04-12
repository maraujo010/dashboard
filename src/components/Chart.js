import React, { Component } from 'react';
import Slider from 'react-rangeslider'
import BarChart from './BarChart.js'
import 'react-rangeslider/lib/index.css'

var SampleData2 = [
  {
    driverID  : "aaaa",
    NSentDatasets: 12
  },
{
      driverID  : "bbbbb",
      NSentDatasets: 12
  }
];

var SampleData = [
  {
    driverID  : "aaaa",
    NSentDatasets: 12
  },
{
      driverID : "dddddd",
      NSentDatasets: 12
  },
  {
        driverID  : "eeeee",
        NSentDatasets: 40
    }
];

class Chart extends Component {

  constructor() {

     super();

     this.sliderTime = 6;

     this.state = {
       chartData: []
     }

  }

  componentWillMount() {

    this.setState({
      chartData: SampleData
    });

  }

  //  handle slider event onChange
  handleOnChange = (value) => {

    this.sliderTime = value;

  }

  // handle slider event onChangeComplete
  handleOnChangeComplete = (value) => {

    this.setState({
      chartData: SampleData2
    });

  }


  render() {

    // slider
    let time = this.sliderTime;

    const formatTime = function(value) {

      let label = "";

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
      <div className="App-histchart-area">
        <div id="TimeSlider">
          <Slider
            min={6}
            max={240}
            tooltip={false}
            step={24}
            value={time}
            orientation="horizontal"
            onChange={this.handleOnChange}
            onChangeComplete={this.handleOnChangeComplete} />
          <div className='value'>{formatTime(time)}</div>
        </div>
        <div id="BarChart">
          <BarChart chartData={this.state.chartData} />
        </div>
      </div>
    );
  }
}

export default Chart;
