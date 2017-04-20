var d3     = require('d3')
var d3Tip  = require('d3-tip')

d3.tip = d3Tip;

class D3Helper {

  constructor(el, type, width, height) {

    this.el   = el;
    this.type = type;

    if (this.type==="bars") {

      this.margin = {top: 20, right: 20, bottom: 30, left: 40};
      this.width  = width - this.margin.left - this.margin.right;
      this.height = height - this.margin.top - this.margin.bottom;

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
    else if (this.type==="bubbles") {

      this.color  = d3.scaleOrdinal(d3.schemeCategory20c);
      this.bubble = d3.pack()
        .size([width, height])
        .padding(1.5);

      this.format = d3.format(",d");
      this.width  = width;
      this.height = height;
    }
  }

  create(data) {

    if (this.type==="bars") {

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
    }
    else if (this.type==="bubbles") {

      this.svg = d3.select(this.el).append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("class", "bubble");
    }

    this.update(data);
  }

  orderOfMagnitude(n) {

    var order = Math.floor(Math.log(n) / Math.LN10);
    return Math.pow(10,order);
  }

  update(data) {

    if (this.type==="bars") {

      var maxNumDrivers = Math.max.apply(Math, data.map(function(d){return d.NumDrivers;}));
      var ticks         = this.orderOfMagnitude(maxNumDrivers)===1 ? maxNumDrivers : this.orderOfMagnitude(maxNumDrivers);

      this.yAxis = d3.axisLeft().scale(this.y)
                  .ticks(ticks)
                  .tickFormat(d3.format('.0f'));

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
      .attr("x", (d) => { return this.x(d.companyID); })
      .attr("width", this.x.bandwidth())
      .attr("height", 0)
      .attr("y", (d) => { return this.height; })
      .transition().duration(700)
      .attr("y", (d) => { return this.y(d.NumDrivers); })
      .attr("height", (d) => { return this.height - this.y(d.NumDrivers); });
    }
    else if (this.type==="bubbles") {

      var root = d3.hierarchy(this.classes(data))
        .sum(function(d) { return d.value; })
        .sort(function(a, b) { return b.value - a.value; });

      this.bubble(root);

      var node = this.svg.selectAll(".node")
        .remove()
        .exit();

      if (typeof root.children !== 'undefined') {

        node = this.svg.selectAll(".node")
          .data(root.children)
          .enter().append("g")
          .attr("class", "node")

        node.append("title")
          .text(function(d) {

            let title = "companyID: " + d.data.packageName +
                        "\ndriverID: " + d.data.className +
                        "\nTimes active: " + d.data.value;

            return title

          });

        node.append("circle")
          .transition().duration(700)
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
          .attr("r", function(d) { return d.r; })
          .style("fill", (d) => {
            return this.color(d.data.packageName+d.data.className);
        });
      }
    }
  }

  // classes for bubble charts
  classes(data) {
    var bubbleData = [];

    for (let i=0; i<data.length; i++) {
      bubbleData.push({
          packageName: data[i].companyID,
          className: data[i].driverID,
          value: data[i].NumTimesActive
      });
    }

    return {children: bubbleData};
  }
}

export default D3Helper
