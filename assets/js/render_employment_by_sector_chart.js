GenderInequality.EmploymentBySectorChart = (function () {

    // Setting chart parameters
    var properties = {
        width: 1500,
        height: 800,
        margin: {
            top: 20,
            right: 50,
            bottom: 130,
            left: 50
        }
    };

    // Calculating chart dimensions
    var chartDimensions = {
        width: properties.width - properties.margin.left - properties.margin.right,
        height: properties.height - properties.margin.top - properties.margin.bottom
    };

    // Appending the chart SVG
    var svg = d3.select("#employmentBySectorChart")
        .append("svg")
        .attr("width", properties.width)
        .attr("height", properties.height)
        .attr("id", "employmentBySectorChartSVG");
    
    // Defining the mouse over function for grouped bars
    function mouseOver(d) {
        // Setting all other grouped bars as translucent
        d3.selectAll(".bar")
            .transition()
            .duration(200)
            .style("opacity", .4);

        // Resetting the current grouped bar being hovered over to opaque
        d3.select(".bar.bar-" + d["Country Code"])
            .transition()
            .duration(200)
            .style("opacity", 1);
        
        var tooltip = d3.select("#employmentSectorTooltip");

        // Setting the position for tooltip
        tooltip.style("top", (event.pageY+10)+"px").style("left", (event.pageX+10)+"px");

        // Setting the content for tooltip
        tooltip.select(".country-name-text").html(d["Country"]);
        tooltip.select(".male-emp-text").html(d["Male"].toFixed(2)+"%");
        tooltip.select(".female-emp-text").html(d["Female"].toFixed(2)+"%");
        tooltip.select(".difference-text").html((d["Female"] - d["Male"]).toFixed(2)+"%");

        // Displaying the relevant indicator
        $("#employmentSectorTooltip .employment-percent-diff .indicator").hide();
        if(d["Female"] - d["Male"] > 0){
            $("#employmentSectorTooltip .employment-percent-diff .increase").show();
        } else {
            $("#employmentSectorTooltip .employment-percent-diff .decrease").show();
        }

        // Setting the tooltip as visible
        return tooltip.style("visibility", "visible");
    }
    
    // Defining the mouse out function for grouped bars
    function mouseLeave(d) {
        // Setting all bars to opaque
        d3.selectAll(".bar")
            .transition()
            .duration(200)
            .style("opacity", 1);

        // Hiding the tooltip
        d3.select("#employmentSectorTooltip").style("visibility", "hidden");
    }

    // Adding a chart container
    var chartContent = svg.append("g").attr("class", "chart-content").attr("transform", "translate(" + properties.margin.left + "," + properties.margin.top + ")");

    var genderKeys = ["Female", "Male"];

    // Defining the yScale
    var yScale = d3.scaleLinear()
        .rangeRound([chartDimensions.height, 0])
        .domain([0, 100]);

    // Defining a function to initialize the chart
    function init_chart() {

        // Fetching the filtered data based on the current selections of the region and sector select
        var filteredData = GenderInequality.filterData.get_filtered_employment_data($("#employmentBySector .region-select").val(), $("#employmentBySector .sector-select").val());

        // Defining the outer scale for grouper bar charts
        var xScale0 = d3.scaleBand()
            .rangeRound([0, chartDimensions.width])
            .paddingInner(0.1)
            .domain(filteredData.map(function (d) { return d.Country; }));;

        // Defining the inner scale for grouped bar charts
        var xScale1 = d3.scaleBand()
            .padding(0.05)
            .domain(genderKeys).rangeRound([0, xScale0.bandwidth()]);;

        // Adding the grouped bars
        chartContent.append("g")
            .attr("class", "grouped-gender-employment-chart")
            .selectAll(".bar")
            .data(filteredData)
            .enter()
            .append("g")
            .attr("class", function(d) { return "bar bar-" + d["Country Code"]; })
            .on("mouseover", mouseOver )
            .on("mouseleave", mouseLeave )
            .attr("transform", function (d) { return "translate(" + xScale0(d.Country) + ",0)"; })
            .selectAll(".employment-rect")
            .data(function (d) { return genderKeys.map(function (key) { return { key: key, value: d[key] }; }); })
            .enter()
            .append("rect")
            .attr("class", function (d) { return "employment-rect " + d.key; })
            .attr("x", function (d) { return xScale1(d.key); })
            .attr("width", xScale1.bandwidth())
            .attr("y", function (d) { return yScale(0); })
            .attr("height", function (d) { return 0; })
            .transition()
            .duration(1000)
            .attr("y", function (d) { return yScale(d.value); })
            .attr("height", function (d) { return chartDimensions.height - yScale(d.value); })
            .attr("fill", function (d) { return GenderInequality.Utils.get_color_for_gender(d.key); });

        // Adding the x axis
        chartContent.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + chartDimensions.height + ")")
            .call(d3.axisBottom(xScale0))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");

        // Adding the y axis
        chartContent.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", yScale(yScale.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("%age Employed");

        // Adding legend
        var legend = chartContent.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .attr("class", "legend-container")
            .selectAll(".legend-item")
            .data(genderKeys.slice().reverse())
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", chartDimensions.width - 17)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", function (d) { return GenderInequality.Utils.get_color_for_gender(d); })
            .attr("stroke", function (d) { return GenderInequality.Utils.get_color_for_gender(d); })
            .attr("stroke-width", 2)

        legend.append("text")
            .attr("x", chartDimensions.width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d) { return d; });
    }

    // Defining function to redraw the chart on interactions with the region and sector select
    function redraw_chart() {

        // Fetching the filtered data based on the current region and sector selections
        var filteredData = GenderInequality.filterData.get_filtered_employment_data($("#employmentBySector .region-select").val(), $("#employmentBySector .sector-select").val());

        // Redefining the outer xScale of grouped bar chart with the new list of countries
        var xScale0 = d3.scaleBand()
            .rangeRound([0, chartDimensions.width])
            .paddingInner(0.1)
            .domain(filteredData.map(function (d) { return d.Country; }));;

        // Redefining the inner xScale of grouped bar charts
        var xScale1 = d3.scaleBand()
            .padding(0.05)
            .domain(genderKeys).rangeRound([0, xScale0.bandwidth()]);;

        // Redrawing the grouped bars per latest data
        chartContent.select(".grouped-gender-employment-chart")
            .selectAll(".bar")
            .remove()
            .exit()
            .data(filteredData)
            .enter()
            .append("g")
            .attr("class", function(d) { return "bar bar-" + d["Country Code"]; })
            .on("mouseover", mouseOver )
            .on("mouseleave", mouseLeave )
            .attr("transform", function (d) { return "translate(" + xScale0(d.Country) + ",0)"; })
            .selectAll(".employment-rect")
            .data(function (d) { return genderKeys.map(function (key) { return { key: key, value: d[key] }; }); })
            .enter()
            .append("rect")
            .attr("x", function (d) { return xScale1(d.key); })
            .attr("class", function (d) { return "employment-rect " + d.key; })
            .attr("width", xScale1.bandwidth())
            .attr("y", function (d) { return yScale(0); })
            .attr("height", function (d) { return 0; })
            .transition()
            .duration(1000)
            .attr("y", function (d) { return yScale(d.value); })
            .attr("height", function (d) { return chartDimensions.height - yScale(d.value); })
            .attr("fill", function (d) { return GenderInequality.Utils.get_color_for_gender(d.key); });

        // Redrawing the x axis
        chartContent.select(".x.axis")
            .call(d3.axisBottom(xScale0))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");
    }
    
    // Bundling all functions and exposing them as package end-points
    return {
        init_chart: init_chart,
        redraw_chart: redraw_chart
    }

}());