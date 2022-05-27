$(function() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 20, left: 70 },
        width = 1200 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#bar_chart_cost_rev")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // ----------------
    // Create a tooltip
    // ----------------
    var tooltip = d3.select("#bar_chart_cost_rev")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
        var subgroupName = d3.select(this.parentNode).datum().key;
        var subgroupValue = d.data[subgroupName];
        tooltip
            .html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
            .style("opacity", 1)
    }
    var mousemove = function(d) {
        tooltip
            .style("left", (d3.mouse(this)[0] + 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
        tooltip
            .style("opacity", 0)
    }
    var mouseclick = function(d) {

    }

    // Parse the Data
    d3.csv("data/movies_metadata_clean.csv", function(data) {

        data.forEach(function(d) { d['budget'] = +d['budget']; });
        data.forEach(function(d) { d['revenue'] = +d['revenue']; });
        data.forEach(function(d) { d['year'] = +d['year']; });

        data = data.sort(function(a, b) { return +a.year - +b.year })

        // Calculate the sums and group data (while tracking count)
        const reduced = data.reduce(function(m, d) {
            if (!m[d.year]) {
                m[d.year] = {...d, count: 1 };
                return m;
            }
            m[d.year].budget += d.budget;
            m[d.year].revenue += d.revenue;
            m[d.year].count += 1;
            return m;
        }, {});

        // Create new array from grouped data and compute the average
        const subgroups = Object.keys(reduced).map(function(k) {
            const item = reduced[k];
            return {
                year: item.year,
                budget: -item.budget / item.count,
                revenue: item.revenue / item.count,
            }
        })

        //console.log(subgroups);
        //console.log((subgroups.map(d => d.year)));

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(subgroups, function(d) { return (d.year) }).keys();


        var x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.2);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var z = d3.scaleOrdinal()
            .range(["steelblue", "darkorange"]);

        svg.append("g")
            .attr("class", "x-axis");

        svg.append("g")
            .attr("class", "y-axis");



        var keys = ["budget", "revenue"];

        var series = d3.stack()
            .keys(keys)
            .offset(d3.stackOffsetDiverging)
            (subgroups);

        x.domain(subgroups.map(d => d.year));

        y.domain([
            d3.min(series, stackMin),
            d3.max(series, stackMax)
        ]).nice();

        var barGroups = svg.selectAll("g.layer")
            .data(series);

        barGroups.exit().remove();

        barGroups.enter().insert("g", ".x-axis")
            .classed('layer', true);

        svg.selectAll("g.layer")
            .transition().duration(750)
            .attr("fill", d => z(d.key));

        var bars = svg.selectAll("g.layer").selectAll("rect")
            .data(function(d) { return d; });

        bars.exit().remove();

        bars = bars
            .enter()
            .append("rect")
            .attr("width", x.bandwidth())
            .attr("x", d => x(d.data.year))
            .merge(bars)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", mouseclick);

        bars.transition().duration(800)
            .attr("y", d => y(d[1]))
            .attr("height", d => Math.abs(y(d[0])) - y(d[1]))
            .delay(function(d, i) { console.log(i); return (i * 100) });

        svg.selectAll(".x-axis").transition().duration(750)
            .attr("transform", "translate(0," + y(0) + ")")
            .call(d3.axisBottom(x));

        svg.selectAll(".y-axis").transition().duration(750)
            .call(d3.axisLeft(y));

        function stackMin(series) {
            return d3.min(series, function(d) { return d[0]; });
        }

        function stackMax(series) {
            return d3.max(series, function(d) { return d[1]; });
        }


    });

});
