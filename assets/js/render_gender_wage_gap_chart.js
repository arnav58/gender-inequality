GenderInequality.GenderWageGapChart = (function () {
    // Setting chart parameters
    var properties = {
        width: 1500,
        height: 800,
        margin: {
            top: 20,
            right: 50,
            bottom: 180,
            left: 50
        }
    };

    // Calculating chart dimensions
    var chartDimensions = {
        width: properties.width - properties.margin.left - properties.margin.right,
        height: properties.height - properties.margin.top - properties.margin.bottom
    };

    var svg = d3.select("#wageGapChart")
        .append("svg")
        .attr("width", properties.width)
        .attr("height", properties.height)
        .attr("id", "wageGapChartSVG");

    // Adding a chart container
    var chartContent = svg.append("g").attr("class", "chart-content").attr("transform", "translate(" + properties.margin.left + "," + properties.margin.top + ")");

    var genderKeys = ["Female", "Male"];

    // Defining the yScale range
    var yScale = d3.scaleLinear()
        .range([chartDimensions.height, 0]);

    // Defining the xScale range
    var xScale = d3.scaleBand()
        .range([0, chartDimensions.width])
        .padding(0.1);
    
    // Defining the mouseover function
    function handle_mouseover(d, $this, show_click_directive=false) {
        // Setting all country wage groups to translucent
        $(".country-wage-group").attr("opacity", 0.2);
        // Resetting the group currently being hovered over to opaque
        d3.select($this).attr("opacity", 1);

        var tooltip = d3.select("#wageGapTooltip");

        // Setting the position for tooltip
        tooltip.style("top", (event.pageY+10)+"px").style("left", (event.pageX+10)+"px");

        // Setting the content for tooltip
        $("#wageGapTooltip .meta").hide();
        if (show_click_directive) {
            $("#wageGapTooltip .country-name").show();
            tooltip.select(".country-name-text").html(d["Country"]);
            $("#wageGapTooltip .click-directive").show();
        } else {
            $("#wageGapTooltip .occupation-name").show();
            tooltip.select(".occupation-name-text").html(d["Occupation"]);
            $("#wageGapTooltip .click-directive").hide();
        }
        tooltip.select(".male-wage-text").html("$" + d["Male"].toFixed(2));
        tooltip.select(".female-wage-text").html("$" + d["Female"].toFixed(2));
        tooltip.select(".difference-text").html("$" + (d["Female"] - d["Male"]).toFixed(2));

        // Displaying the relevant indicator
        $("#wageGapTooltip .wage-gap .indicator").hide();
        if(d["Female"] - d["Male"] > 0){
            $("#wageGapTooltip .wage-gap .increase").show();
        } else {
            $("#wageGapTooltip .wage-gap .decrease").show();
        }

        // Setting the tooltip as visible
        return tooltip.style("visibility", "visible");
    }

    // Defining the mouseout function
    function handle_mouseout(d, $this) {
        $(".country-wage-group").attr("opacity", 1);
        d3.select("#wageGapTooltip").style("visibility", "hidden");
    }
    
    // Defining the function to initialize the wage gap chart
    function init_chart() {
        // Fetching all of the wage gap data
        var filteredData = GenderInequality.filterData.get_filtered_gender_wage_gap_data();

        // Hiding the reset button
        $("#wageGap .reset-chart-btn").hide();

        // Setting the xScale and the yScale
        xScale.domain(filteredData.map(function(d) { return d.Country; }));
        yScale.domain([0, Math.max(d3.max(filteredData, function(d) { return d.Male; }), d3.max(filteredData, function(d) { return d.Female; }))]);

        // Creating placeholder group tags for each country wage group
        var countryWageGroup = chartContent.append("g")
            .attr("class", "gender-wage-gap-chart") 
            .selectAll(".country-wage-group")
            .data(filteredData)
            .enter()
            .append("g")
            .attr("class", function(d){ return "country-wage-group clickable " + d["Country Code"] })
            .on("mouseover", function(d){ return handle_mouseover(d, this, show_click_directive=true) })
            .on("mouseout", function(d){ return handle_mouseout(d, this) })
            .on("click", function(d){ redraw_chart(d.Country); });
        
        // Adding the link between the male income and female income
        countryWageGroup.append("line")
            .attr("x1", function(d){ return xScale(d.Country) + 0.5 * (chartDimensions.width / filteredData.length) - 2 })
            .attr("y1", function(d){ return yScale(d.Male) })
            .attr("x2", function(d){ return xScale(d.Country) + 0.5 * (chartDimensions.width / filteredData.length) - 2 })
            .attr("y2", function(d){ return yScale(d.Female) })
            .attr("stroke", "rgba(190,235,159,0.8)")
            .attr("stroke-width", 2);
        
        // Adding the income bubble for male
        countryWageGroup.append("circle")
            .attr("class", "male-wage-bubble")
            .attr("cx", function(d){ return xScale(d.Country) + 0.5 * (chartDimensions.width / filteredData.length) - 2 })
            .attr("cy", function(d){ return yScale(d.Male) })
            .attr("r", 7)
            .attr("fill", GenderInequality.Utils.get_color_for_gender("Male"));
        
        // Adding the income bubble for female
        countryWageGroup.append("circle")
            .attr("class", "female-wage-bubble")
            .attr("cx", function(d){ return xScale(d.Country) + 0.5 * (chartDimensions.width / filteredData.length) - 2 })
            .attr("cy", function(d){ return yScale(d.Female) })
            .attr("r", 7)
            .attr("fill", GenderInequality.Utils.get_color_for_gender("Female"));
        
        // Adding x axis
        chartContent.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + chartDimensions.height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");
        
        // Adding y axis
        chartContent.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale).ticks(null, "s"))
            .append("text")
            .attr("class", "axis-label")
            .attr("x", 2)
            .attr("y", yScale(yScale.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Income in USD (Daily)");
        
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

    // Defining a function to reset the chart
    function reset_chart() {
        // Fetching all of the available data
        var filteredData = GenderInequality.filterData.get_filtered_gender_wage_gap_data();

        // Hiding the reset button
        $("#wageGap .reset-chart-btn").hide();

        // Setting the xScale and the yScale
        xScale.domain(filteredData.map(function(d) { return d.Country; }));
        yScale.domain([0, Math.max(d3.max(filteredData, function(d) { return d.Male; }), d3.max(filteredData, function(d) { return d.Female; }))]);

        // Recreating the placeholder for country wage group
        var countryWageGroup = chartContent.selectAll(".country-wage-group")
            .remove()
            .exit()
            .data(filteredData)
            .enter()
            .append("g")
            .attr("class", function(d){ return "country-wage-group clickable " + d["Country Code"] })
            .on("mouseover", function(d){ return handle_mouseover(d, this, show_click_directive=true) })
            .on("mouseout", function(d){ return handle_mouseout(d, this) })
            .on("click", function(d){ redraw_chart(d.Country); });
        
        // Adding the link between male and female income bubbles
        countryWageGroup.append("line")
            .attr("x1", function(d){ return xScale(d.Country) + 0.5 * (chartDimensions.width / filteredData.length) })
            .attr("y1", function(d){ return yScale(d.Male) })
            .attr("x2", function(d){ return xScale(d.Country) + 0.5 * (chartDimensions.width / filteredData.length) })
            .attr("y2", function(d){ return yScale(d.Female) })
            .attr("stroke", "rgba(190,235,159,0.8)")
            .attr("stroke-width", 2);
        
        // Adding the male income bubble
        countryWageGroup.append("circle")
            .attr("class", "male-wage-bubble")
            .attr("cx", function(d){ return xScale(d.Country) + 0.5 * (chartDimensions.width / filteredData.length) })
            .attr("cy", function(d){ return yScale(d.Male) })
            .attr("r", 7)
            .attr("fill", GenderInequality.Utils.get_color_for_gender("Male"));
        
        // Adding the female income bubble
        countryWageGroup.append("circle")
            .attr("class", "female-wage-bubble")
            .attr("cx", function(d){ return xScale(d.Country) + 0.5 * (chartDimensions.width / filteredData.length) })
            .attr("cy", function(d){ return yScale(d.Female) })
            .attr("r", 7)
            .attr("fill", GenderInequality.Utils.get_color_for_gender("Female"));
        
        // Redrawing the x axis
        chartContent.selectAll(".x.axis")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");
        
        // Redrawing the y axis
        chartContent.selectAll(".y.axis")
            .call(d3.axisLeft(yScale).ticks(null, "s"))
            .select(".axis-label")
            .attr("x", 2)
            .attr("y", yScale(yScale.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Income in USD (Daily)");
    }

    // Defining a function to draw the country breakdown of income gap by occupation
    function redraw_chart_for_country(country) {
        // Fetching the filtered data for the country selected
        var filteredData = GenderInequality.filterData.get_filtered_gender_wage_gap_data(country);

        // Displaying the reset button
        $("#wageGap .reset-chart-btn").show();

        // Resetting the xScale and the yScale
        xScale.domain(filteredData.map(function(d) { return d.Occupation; }));
        yScale.domain([0, Math.max(d3.max(filteredData, function(d) { return d.Male; }), d3.max(filteredData, function(d) { return d.Female; }))]);

        // Recreating the country wage group placeholders
        var countryWageGroup = chartContent.selectAll(".country-wage-group")
            .remove()
            .exit()
            .data(filteredData)
            .enter()
            .append("g")
            .attr("class", "country-wage-group")
            .on("mouseover", function(d){ return handle_mouseover(d, this) })
            .on("mouseout", function(d){ return handle_mouseout(d, this) })
        
        // Adding the link between male and female income bubbles
        countryWageGroup.append("line")
            .attr("x1", function(d){ return xScale(d.Occupation) + 0.5 * (chartDimensions.width / filteredData.length) })
            .attr("y1", function(d){ return yScale(d.Male) })
            .attr("x2", function(d){ return xScale(d.Occupation) + 0.5 * (chartDimensions.width / filteredData.length) })
            .attr("y2", function(d){ return yScale(d.Female) })
            .attr("stroke", "rgba(190,235,159,0.8)")
            .attr("stroke-width", 2);
        
        // Adding the male income bubble
        countryWageGroup.append("circle")
            .attr("class", "male-wage-bubble")
            .attr("cx", function(d){ return xScale(d.Occupation) + 0.5 * (chartDimensions.width / filteredData.length) })
            .attr("cy", function(d){ return yScale(d.Male) })
            .attr("r", 7)
            .attr("fill", GenderInequality.Utils.get_color_for_gender("Male"));
        
        // Adding the female income bubble
        countryWageGroup.append("circle")
            .attr("class", "female-wage-bubble")
            .attr("cx", function(d){ return xScale(d.Occupation) + 0.5 * (chartDimensions.width / filteredData.length) })
            .attr("cy", function(d){ return yScale(d.Female) })
            .attr("r", 7)
            .attr("fill", GenderInequality.Utils.get_color_for_gender("Female"));
        
        // Redrawing the x axis
        chartContent.selectAll(".x.axis")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");
        
        // Redrawing the y axis
        chartContent.selectAll(".y.axis")
            .call(d3.axisLeft(yScale).ticks(null, "s"))
            .select(".axis-label")
            .attr("x", 2)
            .attr("y", yScale(yScale.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Income in USD (Daily)");
    }
    
    // Defining function to handle the redraw chart request
    function redraw_chart(country="") {
        // Hiding the tooltip on redraw
        d3.select("#wageGapTooltip").style("visibility", "hidden");

        // Setting the appropriate chart header
        $("#wageGap .chart-header").hide();
        if (country === "") {
            reset_chart();
            $("#wageGap .overall").show();
        }
        else {
            redraw_chart_for_country(country);
            $("#wageGap .drill-down .country-name").html(country);
            $("#wageGap .drill-down").show();
        }
    }

    // Bundling all functions and exposing them as package end-points
    return {
        init_chart: init_chart,
        redraw_chart: redraw_chart
    }
}());