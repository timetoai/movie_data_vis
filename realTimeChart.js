export default function addRealTimeChart(data, duration, width, height)
{
  var n = 12;
  var i = 0;
  var pdata = [];
  
  var margin = {
      top: 10,
      right: 40,
      bottom: 30,
      left: 30
  },
      width = width - margin.left - margin.right,
      height = height - margin.top - margin.bottom;

  var rates = data.map((x) => x.rate);

  Array.prototype.max = function() {
    return Math.max.apply(null, this);
  };
  
  Array.prototype.min = function() {
    return Math.min.apply(null, this);
  };
  
  var year = 365 * 60 * 60 * 24 * 1000;
  var x = d3.scaleTime()
        .range([0, width])
        .domain([new Date("1978-12-01"), new Date("1979-12-01")]);
  var y = d3.scaleLinear()
      .domain([rates.min() * 0.9, rates.max() * 1.1])
      .range([height, 0]);

  var line = d3.line()
      .curve(d3.curveBasis)
      .x(function (d, i) {
      return x(new Date(d.ym));
  })
      .y(function (d, i) {
      return y(d.rate);
  });

  var svg = d3.select("#content").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
  svg.append("text")
    .attr("x", width * 0.6)             
    .attr("y", 2 * margin.top)
    .attr("text-anchor", "middle")  
    .style("font-size", "18px")
    .text("Average rating");
  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // extra svg to clip the graph and x axis as they transition in and out
  var graph = g.append("svg")
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom);

  // axes
  function dateFormatter(d)
  {
      if (d.getMonth() == 6)
        return d.getFullYear();
      else
        return "";
  }
  function rateFormatter(r)
  {
      if (r % 1 == 0)
        return Math.round(r);
      else
        return "";
  }
  var xAxis = d3.axisBottom().scale(x)
                .tickFormat(dateFormatter);  
  var axis = graph.append("g")
    //   .attr("display", "none")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(x.axis = xAxis);
  g.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ",0)")
      .call(d3.axisRight().scale(y).tickFormat(rateFormatter));

  var plot = graph.append("g").attr("class", "plot");
  var path = plot//.append("g")
      .append("path")
      .data([pdata])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#000");

  tick();

  function tick() {
      if (i == data.length | d3.select("#content svg")._groups[0][0] == null)
        return;
      // push
      pdata.push(data[i]);
      i++;
      // update the domains
      if (pdata.length > 2)
        x.domain([new Date(new Date(pdata[pdata.length - 3].ym) - year), new Date(pdata[pdata.length - 3].ym)])
      // redraw the lines
      graph.select(".line").attr("d", line);
      plot.attr("transform", null);
      // slide the line left
      if (pdata.length > 1)
        var diff = x(new Date(pdata[pdata.length - 2].ym)) - x(new Date(pdata[pdata.length - 1].ym));
      else
        var diff = x(new Date("1979-12-01")) - x(new Date(pdata[pdata.length - 1].ym));
      plot.transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .attr("transform", "translate(" + diff + ",0)");
      // slide the x-axis left
      axis.transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .call(xAxis)
          .on("end", tick);
      if (pdata.length > n)
        { pdata.shift();}
  }
}