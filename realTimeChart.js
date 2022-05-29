export default function addRealTimeChart(elem, data, duration, width, height)
{
  var n = 12,
      i = 0,
      pdata = [],
      margin = {
        top: Math.min(10, height * 0.05),
        right: Math.min(40, width * 0.1),
        bottom: Math.min(30, height * 0.1),
        left: Math.min(30, width * 0.1)
      },
      width = width - margin.left - margin.right,
      height = height - margin.top - margin.bottom;

  var rates = data.map((x) => x.rate);

  // fixing JavaScript
  Array.prototype.max = function() {
    return Math.max.apply(null, this);
  };
  
  Array.prototype.min = function() {
    return Math.min.apply(null, this);
  };
  function mod(x, n) {
    return ((x % n) + n) % n;
  };
  
  var year = 365 * 60 * 60 * 24 * 1000;
  var x = d3.scaleTime()
        .range([0, width])
        .domain([new Date("1978-12-01"), new Date("1979-12-01")]);
  var y = d3.scaleLinear()
      // .domain([rates.min() * 0.9, rates.max() * 1.1])
      .domain([rates.min(), rates.max()])
      .range([height, 0]);

  var line = d3.line()
      .curve(d3.curveBasis)
      .x(function (d, i) {
      return x(new Date(d.ym));
  })
      .y(function (d, i) {
      return y(d.rate);
  });

  var svg = d3.select(elem).append("svg")
      .attr("class", "rtc")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
  svg.append("text")
    .attr("class", "rtc")
    // .attr("x", width * 0.6)
    .attr("x", margin.left)
    .attr("y", 2 * margin.top)
    // .attr("text-anchor", "middle")
    .text("Movie's average Rating");
  var g = svg.append("g")
      .attr("class", "rtc")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // extra svg to clip the graph and x axis as they transition in and out
  var graph = g.append("svg")
      .attr("class", "rtc")
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
      .attr("class", "rtc x axis")
      .attr("transform", "translate(0," + (height - margin.bottom) + ")")
      .call(x.axis = xAxis);
  g.append("g")
      .attr("class", "rtc y axis")
      .attr("transform", "translate(" + width + ",0)")
      .call(d3.axisRight().scale(y).tickFormat(rateFormatter));

  var plot = graph.append("g").attr("class", "rtc plot");
  var path = plot//.append("g")
      .append("path")
      .data([pdata])
      .attr("class", "rtc line")
      .attr("fill", "none")
      .attr("stroke", "#000");

  tick();

  function tick() {
      if (i == data.length || d3.select(elem + " svg")._groups[0][0] == null)
        return;
      // push
      if (pdata.length == 0 || (mod((new Date(data[i].ym).getMonth() - new Date(pdata[pdata.length - 1].ym).getMonth()), 12) == 1))
      {
        pdata.push(data[i]);
        i++;
      }
      else
      {
        // interpolating month's data
        var nxtDate = new Date(pdata[pdata.length - 1].ym), 
            diff = mod(((new Date(data[i].ym)).getMonth() - (new Date(pdata[pdata.length - 1].ym)).getMonth()), 12);
        nxtDate.setMonth(nxtDate.getMonth() + 1);
        if (nxtDate.getDate() != (new Date(pdata[pdata.length - 1].ym)).getDate()) nxtDate.setDate(0);
        var newObj = {"ym": nxtDate, 
                      "rate": pdata[pdata.length - 1].rate + (data[i].rate - pdata[pdata.length - 1].rate) / diff}
        pdata.push(newObj);
        // console.log("interpolating", pdata[pdata.length - 2], newObj, data[i], diff);
      }
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
      if (pdata.length > n + 3)
        { pdata.shift();}
  }
}