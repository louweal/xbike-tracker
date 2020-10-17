

d3.csv("./exercise_data.csv", function(row, i, headers) {
    // formatter function
    var splitDate = row.day.split("/")
    var ymd = "20" + splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
    var dmy = splitDate[0] + "-" + splitDate[1] + "-" + "20" + splitDate[2];
    return {
        day: dmy,
        date: new Date(ymd),
        duration: +row.duration,
        distance: +row.distance
    };
},
function(error, data) {
    if(error) throw error;

    data.forEach(function(row) {
        row["speed"] = parseFloat((row.distance * 60) / row.duration).toFixed(2);
    });

    var width = 750;
    var height = 400;
    var padding = 50;

    var xScale = d3.scaleLinear()
               .domain(d3.extent(data, d => d.date))
               .range([padding, width - padding]);

    var yScale = d3.scaleLinear()
                .domain([15, 35]) // d3.max(data, d => d.speed)
                .range([height - padding, padding]);


    var yAxis = d3.axisLeft(yScale)
                .tickSize(- width + 2 * padding)
                .tickSizeOuter(0);

    var scatter = d3.select("#scatter")
                .attr("width", width)
                .attr("height", height);

    var tooltip = d3.select("body")
                    .append("div")
                    .classed("tooltip", true);

    scatter.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    scatter
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.speed))
        .attr("r", "0")
        .attr("opacity", "0.1")
        .attr("fill", "var(--c-dark)")
        .attr("stroke", "var(--c-medium)")
        .on("mousemove", showTooltip)
        .on("mouseout", hideTooltip)
        .transition()
        .delay((d,i) => 150*i)
        .duration(150)
        .ease(d3.easeCubicOut)
        .attr("opacity", "1")
        .attr("r", "6");

    /*
    // line
    scatter.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { return xScale(d.date) })
        .y(function(d) { return yScale(d.distance) })
        ) 
    */

    // y-axis label
    scatter.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", - height / 2)
        .attr("dy", padding / 2)
        .style("text-anchor", "middle")
        .text("Speed (km/h)");
            
   function showTooltip(d) {
    tooltip
        .style("opacity", "1")
        .style("left", (d3.event.x - tooltip.node().offsetWidth / 2) + "px")
        .style("top", (d3.event.y + 17) + "px")
        .html(`<p>Date: ${d.day} </p>
                <p>Time: ${d.duration} min</p>
                <p>Distance: ${d.distance} km</p>
                <p>Speed: ${d.speed} km/h</p>`);
}

    function hideTooltip(d) {
        tooltip
            .style("opacity", "0")
    }
})





