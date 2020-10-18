function createPie(width, height) {
  var pie = d3.select("#pie")
              .attr("width", width)
              .attr("height", height);
  
  pie
  .append("g")
      .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")")
      .classed("chart", true);
  
  pie
  .append("g")
      .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")")
      .classed("inner-chart", true);
  
  pie
  .append("text")
      .classed("title", true)
      .attr("x", width / 2)
      .attr("y", 30)
      .style("font-size", "2em")
      .style("text-anchor", "middle");

  // add tooltip div
  d3.select(".pie-chart")
      .append("div")
      .classed("pie-tooltip", true);
      
  pie.append("text")
    .attr("x", width / 2)
    .attr("y", width / 2 + 10)
    .attr("font-size", "1.9em")
    .style("text-anchor", "middle")
    .classed("pie-info", true);   
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


  d3.select(".pie-info")
      .text("");

  var outer = pie
                .select(".chart")
                .selectAll(".arc")
                .data(arcs(data));


  outer
      .exit()
      .remove();

  outer
    .enter()
    .append("path")
      .classed("arc", true)
      .attr("fill", (d, i) => `rgba(42, 37, 112, ${d.data.distance / maxDistancePerDay})`)
      .on("mousemove", showPieInfo)
      .on("mouseout", hidePieInfo)
    .merge(outer)
      .transition()
      .delay((d,i) => 160*i)
      .duration(160)
      .attr("d", path);

  outer
    .enter()
    .append('text')
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")";  })
    .style("text-anchor", "middle")
    .style("fill", (d, i) => setTextColor(d))
    .style("font-size", 17)
    .on("mousemove", showPieInfo)
    .on("mouseout", hidePieInfo)            
    .transition()
    .delay((d,i) => 120*i)
    .duration(120)
    .text(function(d){ return d.data.day})

}

function setTextColor(d) {
  var todayDay = today.toLocaleString(undefined, {weekday: 'short'}).toUpperCase();

  if (todayDay === d.data.day) {
    return `rgba(255, 217, 0, 1)`
  }
  return `rgba(255, 255, 255, 1)`

}


function getDataByWeekday(data) {

  var weekdayTallies = orderedWeekdays.map(n => ({ day: n, distance: 0 }));

  for (var i = 0; i < data.length; i++) {      
      var row = data[i];
      var day = orderedWeekdays.indexOf(row.weekday);
      weekdayTallies[day].distance += row.distance;
  }
  return weekdayTallies;
} 

function showPieInfo(d) {
  d3.select(".pie-info")
      .text(d.data.percentage + "%");
}

function hidePieInfo(d) {
  d3.select(".pie-info")
      .text("");
}