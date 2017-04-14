var d3     = require('d3')
var d3Tip  = require('d3-tip')

d3.tip = d3Tip;

class D3Helper {

  constructor(el) {

    this.el = el;

    this.margin = {top: 20, right: 20, bottom: 30, left: 40};
    this.width  = 600 - this.margin.left - this.margin.right;
    this.height = 390 - this.margin.top - this.margin.bottom;

    this.x      = d3.scaleBand()
                  .rangeRound([0, this.width])
                  .padding(0.1);

    this.y      = d3.scaleLinear()
                  .range([this.height, 0]);

    this.xAxis  = d3.axisBottom().scale(this.x);

    this.tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span>CompanyID: " + d.companyID + "</span><br/>" +
               "<span>Active drivers: " + d.NumDrivers + "</span>";
    });

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

  orderOfMagnitude(n) {

    var order = Math.floor(Math.log(n) / Math.LN10);
    return Math.pow(10,order);
  }

  update(data) {

    var maxNumDrivers = Math.max.apply(Math, data.map(function(d){return d.NumDrivers;}));

    this.yAxis  = d3.axisLeft().scale(this.y)
                  .ticks(this.orderOfMagnitude(maxNumDrivers)==1 ? maxNumDrivers : this.orderOfMagnitude(maxNumDrivers))
                  .tickFormat(d3.format('.0f'));

    var _self = this;

    this.x.domain(data.map(function(d) { return d.companyID; }));
    this.y.domain([0, maxNumDrivers]);

    this.svg.select('.x.axis').transition().duration(300).call(this.xAxis);
    this.svg.select(".y.axis").transition().duration(300).call(this.yAxis);

    this.svg.call(this.tip);

    var bars = this.svg.selectAll(".bar")
    .remove()
    .exit();

    bars.data(data)
    .enter().append("rect")
    .on('mouseover', this.tip.show)
    .on('mouseout', this.tip.hide)
    .attr("class", "bar")
    .transition().duration(300)
    .attr("x", function(d) { return _self.x(d.companyID); })
    .attr("width", this.x.bandwidth())
    .attr("y", function(d) { return _self.y(d.NumDrivers); })
    .attr("height", function(d) { return _self.height - _self.y(d.NumDrivers); });
    }

}

export default D3Helper
