var d3 = require('d3');

class D3Helper {

  constructor(el) {

    this.el = el;

    this.margin = {top: 20, right: 20, bottom: 30, left: 40};
    this.width  = 650 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.x      = d3.scaleBand()
                  .rangeRound([0, this.width])
                  .padding(0.1);

    this.y      = d3.scaleLinear()
                  .range([this.height, 0]);

    this.xAxis  = d3.axisBottom().scale(this.x);

    this.yAxis  = d3.axisLeft().scale(this.y).ticks(10);

  }

  create(data) {

    this.svg = d3.select(this.el).append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")

    this.svg.append("g")
      .attr("class", "y axis")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em");

    this.update(data);

  }

  update(data) {

    var _this = this;

    this.x.domain(data.map(function(d) { return d.driverID; }));
    this.y.domain([0, d3.max(data, function(d) { return d.NSentDatasets; })]);

    this.svg.select('.x.axis').transition().duration(300).call(this.xAxis);
    this.svg.select(".y.axis").transition().duration(300).call(this.yAxis);

    var bars = this.svg.selectAll(".bar")
    .remove()
    .exit();

    bars.data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .transition().duration(300)
    .attr("x", function(d) { return _this.x(d.driverID); })
    .attr("width", this.x.bandwidth())
    .attr("y", function(d) { return _this.y(d.NSentDatasets); })
    .attr("height", function(d) { return _this.height - _this.y(d.NSentDatasets); });

    }

}

export default D3Helper
