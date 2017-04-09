import React, { Component } from 'react';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import rd3 from 'react-d3-library';

const BarChart = rd3.BarChart;

// hardcoded data
const data = {}

data.dataSet = [
    {label: "id:23", value: 5},
    {label: "id:7", value: 12},
    {label: "id:9", value: 26},
    {label: "id:70", value: 4},
    {label: "id:65", value: 6},
    {label: "id:96", value: 10},
    {label: "id:43", value: 21},
    {label: "id:29", value: 20},
    {label: "id:73", value: 16},
    {label: "id:21", value: 19},
    {label: "id:68", value: 21}
  ];

data.margins = {top: 20, right: 20, bottom: 70, left: 40};
data.fill = [];
data.width = 600;
data.height = 300;
data.ticks = 5;
data.barClass = 'bar';

class HistChart extends Component {

  constructor(props, context) {

     super(props, context)

     this.state = {
       time: 6,
       d3: ''
     }
  }

  // handler for slider
  handleOnChange = (value) => {
   this.setState({
     time: value
   });
  }

  // handler for slider
  handleOnChangeComplete = (value) => {

  }


  componentDidMount() {

    this.setState({d3: data});
  }

  render() {

    // slider
    let { time } = this.state;

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
        <div id="timeSlider">
          <Slider
            min={6}
            max={240}
            tooltip={false}
            step={24}
            value={time}
            orientation="horizontal"
            onChange={this.handleOnChange}
            onChangeComplete={this.handleOnChangeComplete}
          />
          <div className='value'>{formatTime(time)}</div>
        </div>
        <div id="j3Chart">
          <BarChart data={this.state.d3} />
        </div>
      </div>
    );
  }
}

export default HistChart;
