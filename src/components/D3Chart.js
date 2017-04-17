import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import D3Helper from './D3Helper.js'

class D3Chart extends Component {

  componentDidMount() {

    var el = ReactDOM.findDOMNode(this);

    this.d3Helper = new D3Helper(el, this.props.type);
    this.d3Helper.create(this.props.chartData);
  }

  componentWillReceiveProps(props) {

    // check if chartData changed in the parent component
    if (props.chartData!==this.props.chartData) {

      if (this.chartDataChanged(props.chartData, this.props.chartData))
        this.d3Helper.update(props.chartData)
    }
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

  chartDataChanged(oldData, newData) {

    if (oldData.length!==newData.length)
      return true;
    else
      for (let i=0; i<oldData.length; i++) {
        if (JSON.stringify(oldData[i]) !== JSON.stringify(newData[i]))
          return true;
      }

    return false;
  }

  render() {
    return (
      <div className="Chart"></div>
    );
  }
}

export default D3Chart
