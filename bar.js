
function createBar(width, height) {
  var padding = 50;

  var bar = d3.select("#bar")
  .attr("width", width)
  .attr("height", height);

  bar.append("g")
  .attr("transform", "translate(0," + (height - padding) + ")")
  .classed("bar-x-axis", true);

  bar.append("g")
  .attr("transform", "translate(" + padding + ", 0)")
  .classed("bar-y-axis", true);

  bar.append("text")
  .attr("x", width / 2)
  .attr("y", height - 10)
  .style("text-anchor", "middle")
  .text("Month");

  bar.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", - height / 2)
  .attr("y", 15)
  .style("text-anchor", "middle")
  .text("Distance");

}

function drawBar(data) {
  var initialBinCount = 4;  

  updateRects(initialBinCount, data);
}


function updateRects(val, data) {
  var barPadding = 1;
  var padding = 50;

  var bar = d3.select("#bar");

  var width = +bar.attr("width");
  var height = +bar.attr("height");

  /*
  var xScale = d3.scaleLinear()
                 .domain(d3.extent(data, d => d.distance))
                 .rangeRound([padding, width - padding]);

  */

  var xScale = d3.scaleTime().range([0, width]);
 
  // Determine the first and list dates in the data set
  var monthExtent = d3.extent(data, function(d) { return d.date; });

  // Create one bin per month, use an offset to include the first and last months
  var monthBins = d3.timeMonths(d3.timeMonth.offset(monthExtent[0],-1),
                                  d3.timeMonth.offset(monthExtent[1],1));                 

  console.log(monthBins);

  var histogram = d3.histogram()
                    .domain(xScale.domain())
                    .thresholds(xScale.ticks(val))
                    .value(d => d.distance);

  var bins = histogram(data);

  var yScale = d3.scaleLinear()
                 .domain([0, d3.max(bins, d => d.length)])
                 .range([height - padding, padding]);
  
  d3.select(".bar-y-axis")
      .call(d3.axisLeft(yScale));

  d3.select(".bar-x-axis")
      .call(d3.axisBottom(xScale)
              .ticks(val))
    .selectAll("text")
      .attr("y", -3)
      .attr("x", 10)
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start");

  var rect = bar
               .selectAll("rect")
               .data(bins);

  rect
    .exit()
    .remove();

  rect
    .enter()
      .append("rect")
    .merge(rect)
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(0))
      .attr("height", 0)
      .attr("width", d => xScale(d.x1) - xScale(d.x0) - barPadding)
      .attr("fill", "var(--c-dark)")
      .transition()
      .duration(1500)
        .attr("y", d => yScale(d.length))
        .attr("height", d => height - padding - yScale(d.length))


}
