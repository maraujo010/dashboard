import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import D3Helper from './D3Helper.js'


class D3Chart extends Component {

  componentDidMount() {

    var el = ReactDOM.findDOMNode(this);

    this.d3Helper = new D3Helper(el);
    this.d3Helper.create(this.props.chartData);

  }

  componentWillReceiveProps(props) {

    if (props.chartData!=this.props.chartData)
      this.d3Helper.update(props.chartData)

  }

  render() {
    return (
      <div className="Chart"></div>
    );
  }
}

export default D3Chart
