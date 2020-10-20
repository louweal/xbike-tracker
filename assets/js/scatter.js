
function createScatter(width, height) {
    var scatter = d3.select("#scatter")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", `0 0 ${width} ${height}`);

    scatter.append("g")
        .classed("y-axis", true);
            
    d3.select(".scatter-plot")
        .append("div")
        .classed("tooltip", true);   
        
}

function drawScatter(data) {
    var scatter = d3.select("#scatter");
    var padding = 30; 
    var width = +scatter.attr("width")
    var height = +scatter.attr("height")

    var xScale = d3.scaleLinear()
               .domain(d3.extent(data, d => d.date))
               .nice()
               .range([padding, width - padding]);

    var yScale = d3.scaleLinear()
               .domain([18, 2*Math.ceil(d3.max(data, d => d.speed) /2) ]) // round upper bound of yscale upwards to nearest even number  
               .range([height - padding, padding]);


   var yAxis = d3.axisLeft(yScale)
               .tickSize(5);
         
    d3.select(".y-axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);


    // line
    scatter.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "var(--c-dark)")
        .attr("stroke-width", 3)
        .attr("d", d3.line()
        .x(function(d) { return xScale(d.date) })
        .y(function(d) { return yScale(d.speed) })
        ) 
        
    scatter
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
        .classed("scatter-circle", true)
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.speed))
        .attr("r", "0")
        .attr("opacity", "0.1")
        .attr("fill", d => setScatterColor(data, d.speed))
        .on("mousemove", showScatterTooltip)
        .on("mouseout", hideScatterTooltip)
        .transition()
        .delay((d,i) => 100*i)
        .duration(100)
        .ease(d3.easeCubicOut)
            .attr("opacity", "1")
            .attr("r", "7");
}

// show info on data point mouse over 
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

// hide tooltip on mouse out
function hideScatterTooltip(d) {
    d3.select(".tooltip") 
       .style("opacity", "0")
}

// color all points purple except for the best speed data point(s) -> gold
function setScatterColor(data, s) {
    var bestSpeed = d3.max(data, d => d.speed);
    if(s !== bestSpeed) {
        return "var(--c-dark)";
    }
    return "var(--c-accent)"
}