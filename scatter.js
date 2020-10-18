
function createScatter(width, height) {

    var scatter = d3.select("#scatter")
                .attr("width", width)
                .attr("height", height);

    scatter.append("g")
        .classed("y-axis", true);                

    d3.select(".scatter-plot")
        .append("div")
        .classed("tooltip", true);       
}

function drawScatter(data) {
    var scatter = d3.select("#scatter");
    var padding = 50; 
    var width = +scatter.attr("width")
    var height = +scatter.attr("height")

    var xScale = d3.scaleLinear()
               .domain(d3.extent(data, d => d.date))
               .nice()
               .range([padding, width - padding]);

    var yScale = d3.scaleLinear()
               .domain([18, 32]) // d3.max(data, d => d.speed)
               .nice()
               .range([height - padding, padding]);


   var yAxis = d3.axisLeft(yScale)
               .tickSize(-width + 2 * padding)
               .tickSizeOuter(1);

    d3.select(".y-axis")
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
        .attr("fill", d => setScatterColor(data, d.speed))
        //.attr("stroke", "var(--c-medium)")
        .on("mousemove", showScatterTooltip)
        .on("mouseout", hideScatterTooltip)
        .transition()
        .delay((d,i) => 100*i)
        .duration(100)
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
    /*scatter.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", - height / 2)
        .attr("dy", padding / 2)
        .style("text-anchor", "middle")
        .text("Speed (km/h)"); */
}

function showScatterTooltip(d) {
    var tooltip = d3.select(".tooltip"); 

    tooltip
        .style("opacity", "1")
        .style("left", (d3.event.x - tooltip.node().offsetWidth / 2) + "px")
        .style("top", (d3.event.y + 17) + "px")
        .html(`<p>Date: ${d.day} </p>
                <p>Time: ${d.duration} min</p>
                <p>Distance: ${d.distance} km</p>
                <p>Speed: ${d.speed} km/h</p>`);
}

function hideScatterTooltip(d) {
    var tooltip = d3.select(".tooltip"); 

    tooltip
        .style("opacity", "0")
}

function setScatterColor(data, s) {
    var bestSpeed = d3.max(data, d => d.speed);
    if(s !== bestSpeed) {
        return "var(--c-dark)";
    }
    return "var(--c-accent)"
}