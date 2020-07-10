GenderInequality.WomenInParliament = (function () {

    // Setting chart parameters
    var properties = {
        width: 1500,
        height: 800,
        margin: {
            top: 20,
            right: 50,
            bottom: 20,
            left: 50
        }
    };

    // Calculating chart dimensions
    var chartDimensions = {
        width: properties.width - properties.margin.left - properties.margin.right,
        height: properties.height - properties.margin.top - properties.margin.bottom
    };

    // Setting the color gradient
    var colorScale = d3.scaleThreshold()
        .domain(d3.range(0, 50))
        .range(GenderInequality.Utils.colorGradient.reverse());

    // Appending the chart SVG
    var svg = d3.select("#womenInParliamentChart")
        .append("svg")
        .attr("width", properties.width)
        .attr("height", properties.height)
        .attr("id", "womenInParliamentChartSVG");

    // Creating a mercator projection object
    var projection = d3.geoMercator()
        .scale(160)
        .center([0,20])
        .translate([chartDimensions.width / 2, chartDimensions.height / 2]);
    
    // Defining the mouse over function
    function mouseOver(d) {
        // Setting all country paths to translucent
        d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", .4)
            .style("stroke", "transparent");

        // Setting current country being hovered over to opaque and adding stroke to it
        d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", "black");
    
        var tooltip = d3.select("#parliamentTooltip");

        // Setting the position for tooltip
        tooltip.style("top", (event.pageY+10)+"px").style("left", (event.pageX+10)+"px");

        // Setting the content for tooltip
        tooltip.select(".country-name-text").html(d.properties.name);
        tooltip.select(".women-parliament-text").html(GenderInequality.filterData.get_filtered_women_in_parliament_value(d.id).toFixed(2)+"%");

        if (GenderInequality.filterData.get_filtered_women_in_parliament_value(d.id) == 0) {
            tooltip.select(".women-parliament-text").html("Data Unavailable");
        }

        // Setting the tooltip as visible
        return tooltip.style("visibility", "visible");
    }
        
    // Defining the mouse out function
    function mouseLeave(d) {
        // Setting all countries back to opaque and removing the stroke
        d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", "transparent");
        
        // Hiding the tooltip
        d3.select("#parliamentTooltip").style("visibility", "hidden");
    }

    // Adding a chart container
    var chartContent = svg.append("g").attr("class", "chart-content").attr("transform", "translate(" + properties.margin.left + "," + properties.margin.top + ")");

    // Loading the geojson for world map
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(error, data) {
        // Appending paths for each country in geojson with color of the country determined by the value fetched for that country
        chartContent.selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            // draw each country
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            // set the color of each country
            .attr("fill", function (d) {
                d.total = GenderInequality.filterData.get_filtered_women_in_parliament_value(d.id);
                return colorScale(d.total);
            })
            .attr("class", function(d){ return "Country " + d.properties.name } )
            .attr("data-country-name", function(d){ return d.properties.name })
            .attr("data-value", function(d){ return GenderInequality.filterData.get_filtered_women_in_parliament_value(d.id); })
            .on("mouseover", mouseOver )
            .on("mouseleave", mouseLeave );
    });
}());