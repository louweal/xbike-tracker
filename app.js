var today = new Date();

// pie:
var todayDay = today.toLocaleString(undefined, {weekday: 'short'}).toUpperCase();
var orderedWeekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];



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

    // todo: remove ALL duplication !!!!!!!!!!!!!!!!!!!!!
    data.forEach(function(row) {
        row["speed"] = parseFloat((row.distance * 60) / row.duration).toFixed(2);
    });

    /* stats */ 

    var lastrow = data[data.length-1];

    if(lastrow.date === today) {
        d3.select("#today-distance").text(lastrow.distance + " km");
        d3.select("#today-speed").text(lastrow.speed + " km/h");
    } 

    var monthData = data.filter(d => (d.date.getMonth() === today.getMonth()) & (d.date.getYear() === today.getYear()));
    var monthDistance = d3.sum(monthData, d => d.distance);
    var monthSpeed = parseFloat(d3.mean(monthData, d => d.speed)).toFixed(2);
    d3.select("#month-distance").text(monthDistance + " km");
    d3.select("#month-speed").text(monthSpeed + " km/h");

    var totalDistance = d3.sum(data, d => d.distance)
    d3.select("#total-distance").text(totalDistance + " km");

    var totalTime = parseFloat((d3.sum(data, d => d.duration) / 60)).toFixed(1);
    d3.select("#total-time").text(totalTime + " h");

    var averageSpeed = parseFloat(d3.mean(data, d => d.speed)).toFixed(2);
    d3.select("#average-speed").text(averageSpeed + " km/h");

    var maxSpeed = (d3.max(data, d => d.speed));
    d3.select("#max-speed").text(maxSpeed + " km/h");
 
    /* pie */ 

    var width = 400;
    var height = 400;
  
    data.forEach(function(row) {
      row['weekday'] = row.date.toLocaleString(undefined, {weekday: 'short'}).toUpperCase();
    })
  
    var weekData = getDataByWeekday(data);
    
    createPie(width, height);
    drawPie(weekData);
    
    /* end of pie */

  });