
function drawBar(width, height, data) {

  var maxDistance = d3.max(data, d => d.distance);

  const bar = d3.select('#bar')
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);
    
  const margin = 32;
  width = width - 2 * margin;
  height = height - 2 * margin;

  const chart = bar.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

    const xScale = d3.scaleBand()
    .range([0, width])
    .domain(data.map((s) => s.month))
    .padding(0.1)
  
  const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, maxDistance + 10]);

    
  const makeYLines = () => d3.axisLeft()
    .scale(yScale)
  
    
  chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  chart.append('g')
    .call(d3.axisLeft(yScale));

  
  chart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
      .tickSize(-width, 0, 0)
      .tickFormat('')
      .tickSizeOuter(0)
    ) 

  const barGroups = chart.selectAll()
    .data(data)
    .enter()
    .append('g')

  barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.month))
    .attr('y', height)
    .attr('height', 0)
    .attr('width', xScale.bandwidth())
    .on('mouseenter', function (actual, i) {
      d3.selectAll('.value')
        .attr('opacity', 0)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.6)

      const y = yScale(actual.distance)

      line = chart.append('line')
        .attr('id', 'limit')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', width)
        .attr('y2', y)

      barGroups.append('text')
        .attr('class', 'divergence')
        .attr('x', (a) => xScale(a.month) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.distance) + 30)
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .text((a, idx) => {
          const divergence = -(100 - (100 * a.distance) / actual.distance).toFixed(0)
          
          let text = ''
          if (divergence > 0) text += '+'
          text += `${divergence}%`

          return idx !== i ? text : '';
        })

    })
    .on('mouseleave', function () {
      d3.selectAll('.value')
        .attr('opacity', 1)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 1)
        .attr('x', (a) => xScale(a.month))
        .attr('width', xScale.bandwidth())

      chart.selectAll('#limit').remove()
      chart.selectAll('.divergence').remove()
    })
    .transition("growBars")
    .duration(1000)
    .attr('y', (g) => yScale(g.distance))
    .attr('height', (g) => height - yScale(g.distance))


  barGroups 
    .append('text')
    .attr('class', 'value')
    .attr('x', (a) => xScale(a.month) + xScale.bandwidth() / 2)
    .attr('y', (a) => yScale(a.distance) + 30)
    .attr('opacity', '0')
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--c-light)')
    .text("")
    .transition()
    .duration(200)
    .delay(750)
      .attr('opacity', '1')
     .text((a) => `${parseFloat(a.distance).toFixed(0)}`)
}

function getDataByMonth(data) {
  // list all unique months+years in dataset (e.g. JUL'20, AUG'20)
  var orderedMonths = data.map(a => a.monthYear);
  orderedMonths = [...new Set(orderedMonths)];

  var monthTallies = orderedMonths.map(n => ({month: n, distance: 0}));

  // sum all distances for each month
  for (var i = 0; i < data.length; i++) {      
      var row = data[i];
      var month = orderedMonths.indexOf(row.monthYear);

      monthTallies[month].distance += row.distance;
  }
 
  return monthTallies;
} 