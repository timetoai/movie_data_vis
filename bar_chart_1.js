export default function addBarChartCR() {
    // set the dimensions and margins of the graph
    var margin = { top: 80, right: 80, bottom: 210, left: 160 },
        width = 1500 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#bar_chart_cost_rev")
        .append("svg")
        //.attr("width", width + margin.left + margin.right)
        //.attr("height", height + margin.top + margin.bottom)
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr(
            'viewBox',
            '0 0 ' +
            (width + margin.left + margin.right) +
            ' ' +
            (height + margin.top + margin.bottom)
        )
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // ----------------
    // Create a tooltip
    // ----------------
    var tooltip = d3.select("#bar_chart_cost_rev")
        .append("div")
        .style("opacity", 0)
        .style("width", "600px")
        .style("column-count", 2)
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
        var year = d.data.year;
        tooltip
            .html("Year = " + year + "<br>" + subgroupName + " = " + subgroupValue)
            .style("opacity", 1)

    }
    var mousemove = function(d) {
        tooltip
            .style("left", (d3.mouse(this)[0] + 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
        d3.select(this).attr("opacity", 1);
        tooltip
            .style("opacity", 0)
    }
    var isOnStartChart = true;
    var mouseclick = function(d) {

        if (isOnStartChart) {
            var file_path = "data/top_films_" + String(d.data['year']) + ".csv"
            isOnStartChart = false;
            update(file_path)

        } else {
            isOnStartChart = true;
            update("data/movies_metadata_clean.csv")

        }
    }

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.2);

    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var yAxis = svg.append("g")
        .attr("class", "myYaxis")

    var z = d3.scaleOrdinal()
        .range(["darkorange", "steelblue"]);

    svg.append("g")
        .attr("class", "x-axis");

    svg.append("g")
        .attr("class", "y-axis");


    function update(file_name) {
        // Parse the Data
        d3.selectAll('.rect').remove();

        if (!isOnStartChart) {
            var mouseover = function(d) {
                d3.select(this).attr("opacity", 0.5)

                var title = d.data.title;
                var date = d.data.date;
                var budget = Math.round(-d.data.budget);
                var revenue = Math.round(d.data.revenue);
                var profit = Math.round(d.data.profit);
                var country = d.data.country;
                var vote_count = Math.round(d.data.vote_count);
                var vote_average = d.data.vote_average;

                tooltip
                    .html("Title: " + title + "<br>" + "Budget: " + budget + " $" + "<br>" +
                        "Revenue: " + revenue + " $" + "<br>" + "Profit: " + profit + " $" + "<br>" +
                        "Rating: " + vote_average + "<br>" + "Votes Number: " + vote_count + "<br>" +
                        "Country: " + country + "<br>" + "Release date: " + date + "<br>")
                    .style("opacity", 1)
                    .style("font-size", "19px")

            }
        } else {
            var mouseover = function(d) {
                d3.select(this).attr("opacity", 0.55)

                var subgroupName = d3.select(this.parentNode).datum().key;
                var subgroupValue = Math.round(d.data[subgroupName]);
                var year = d.data.year;
                tooltip
                    .html("Year: " + year + "<br>" + subgroupName + ": " + subgroupValue + " $")
                    .style("opacity", 1)
                    .style("font-size", "19px")
            }
        }

        d3.csv(file_name, function(data) {
            var subgroups = 0;
            svg.selectAll(".chart_title").remove();
            svg.selectAll(".x_title").remove();
            svg.selectAll(".y_title").remove();

            if (isOnStartChart) {
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
                subgroups = Object.keys(reduced).map(function(k) {
                    const item = reduced[k];
                    return {
                        year: item.year,
                        budget: -item.budget / item.count,
                        revenue: item.revenue / item.count,
                    }
                })
            } else {
                subgroups = data.map(function(k) {
                    return {
                        title: k.title,
                        budget: -k.budget,
                        revenue: k.revenue,
                        country: k.production_countries,
                        vote_count: k.vote_count,
                        vote_average: k.vote_average,
                        profit: k.profit,
                        date: k.release_date,
                    }
                })
            }


            //console.log(subgroups);
            //console.log((subgroups.map(d => d.year)));

            var keys = ["budget", "revenue"];

            var series = d3.stack()
                .keys(keys)
                .offset(d3.stackOffsetDiverging)
                (subgroups);

            if (isOnStartChart) {
                x.domain(subgroups.map(d => d.year));
            } else {
                x.domain(subgroups.map(d => d.title));
            }
            //xAxis.call(d3.axisBottom(x))

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
                .attr("x", d => x(isOnStartChart ? d.data.year : d.data.title))
                .attr("width", x.bandwidth())
                .merge(bars)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                .on("click", mouseclick)


            bars.transition().duration(800)
                .attr("y", d => y(d[1]))
                .attr("x", d => x(isOnStartChart ? d.data.year : d.data.title))
                .attr("height", d => Math.abs(y(d[0])) - y(d[1]))
                .attr("width", d => x.bandwidth())
                .delay(function(d, i) { return (i * 100) });

            svg.selectAll(".x-axis").transition().duration(750)
                .attr("transform", "translate(0," + y(0) + ")")
                .style("font-size", "15px")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");

            svg.selectAll(".y-axis").transition().duration(750)
                .style("font-size", "18px")
                .call(d3.axisLeft(y));

            svg.append("text")
                .attr("class", "chart_title")
                .attr("x", width / 2)
                .attr("y", -20)
                .attr("text-anchor", "middle")
                .style("font-size", "32px")
                .text(isOnStartChart ? "Films Budget / Revenue change over time" :
                    "Top films of the year by profit");

            svg.append("text")
                .attr("class", "y_title")
                .attr("transform", "rotate(-90)")
                .attr("x", -(width / 6))
                .attr("y", -140)
                .attr("text-anchor", "middle")
                .style("font-size", "24px")
                .text("Budget / Revenue, $");

            if (isOnStartChart) {
                svg.append("text")
                    .attr("class", "x_title")
                    .attr("x", width / 2)
                    .attr("y", height)
                    .attr("text-anchor", "middle")
                    .style("font-size", "24px")
                    .text("Year");
            }

            function stackMin(series) {
                return d3.min(series, function(d) { return d[0]; });
            }

            function stackMax(series) {
                return d3.max(series, function(d) { return d[1]; });
            }

            bars
                .exit()
                .remove()

        });
    }
    update("data/movies_metadata_clean.csv")


};
