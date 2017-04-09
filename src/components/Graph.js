import React, { Component } from 'react';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

class Graph extends Component {

  constructor(props, context) {

     super(props, context)
     this.state = {
       time: 6
     }
   }

   handleOnChange = (value) => {
     this.setState({
       time: value
     })
   }

  render() {

    let { time } = this.state;

    const formatTime = function(value) {

      let label = "";

      if (value<24)
        label = value + ' hours';
      else {
        let nDays    = Math.trunc(value/24);
        let dayLabel = nDays > 1 ? ' days' : ' day';

        label        = nDays + dayLabel;
      }

      return label
    }

    return (
      <div id="timeSlider">
        <Slider
          min={6}
          max={240}
          tooltip={false}
          step={6}
          value={time}
          orientation="horizontal"
          onChange={this.handleOnChange}
        />
        <div className='value'>{formatTime(time)}</div>
      </div>
    );
  }
}

export default Graph;
