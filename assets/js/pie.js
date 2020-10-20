function createPie(width, height) {
  var pie = d3.select("#pie")
              .attr("width", width)
              .attr("height", height)
              .attr("viewBox", `0 0 ${width} ${height}`);
  
  pie
  .append("g")
      .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")")
      .classed("chart", true);
      
  pie.append("text")
    .attr("x", width / 2)
    .attr("y", width / 2 + 10)
    .classed("percentage", true);   
}

function drawPie(data) {

  var pie = d3.select("#pie");
  var maxDistancePerDay = d3.max(data, d => d.distance);
  var width = +pie.attr("width");

  var arcs = d3.pie()
                .sort((a, b) => orderedWeekdays.indexOf(a.weekday) - orderedWeekdays.indexOf(b.weekday))
                .value(d => d.distance);

  var path = d3.arc()
                .innerRadius(width / 6)
                .outerRadius(width / 2.4)
                .padAngle(0.02);

  var outer = pie
                .select(".chart")
                .selectAll(".arc")
                .data(arcs(data));

  outer
    .enter()
    .append("path")
      .classed("arc", true)
      .attr("fill", (d, i) => `rgba(42, 37, 112, ${d.data.distance / maxDistancePerDay})`)
      .attr("opacity", "0")
      .on("mousemove", showPieInfo)
      .on("mouseout", hidePieInfo)
    .merge(outer)
      .transition()
      .delay((d,i) => 160*i)
      .duration(160)
      .attr("d", path)
      .transition()
      .delay((d,i) => 80 + 160*i)
      .duration(200)
      .attr("opacity", "1");

  outer
    .enter()
    .append('text')
    .classed('weekday', true)
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")";  })
    .attr("opacity", "0")
    .style("fill", (d, i) => setTextColor(d))
    .on("mousemove", showPieInfo)
    .on("mouseout", hidePieInfo)            
    .transition()
      .delay((d,i) => 120*i)
      .duration(120)
      .text(function(d){ return d.data.day})
    .transition()
      .delay((d,i) => 60 + 120*i)
      .duration(120)
      .attr("opacity", "1")
}

// show todays weekday text gold and other weekdays white
function setTextColor(d) {
  if (todayDay !== d.data.day) {
    return `rgba(255, 255, 255, 1)`
  }
  return `rgba(255, 217, 0, 1)`

}

// show percentage on mouse over
function showPieInfo(d) {
  d3.select(".percentage")
      .text(d.data.percentage + "%");
}

// hide percentage on mouse out
function hidePieInfo(d) {
  d3.select(".percentage")
      .text("");
}

// aggregates (sums) data by weekday
function getDataByWeekday(data) {

  var weekdayTallies = orderedWeekdays.map(n => ({ day: n, distance: 0 }));

  for (var i = 0; i < data.length; i++) {      
      var row = data[i];
      var day = orderedWeekdays.indexOf(row.weekday);
      weekdayTallies[day].distance += row.distance;
  }
  return weekdayTallies;
} 
