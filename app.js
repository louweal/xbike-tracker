var today = new Date();

//var todayDay = today.toLocaleString(undefined, {weekday: 'short'}).toUpperCase();
var orderedWeekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

d3.csv("./exercise_data.csv", function(row, i, headers) {
    // formatter function
    var splitDate = row.day.split("/")
    var ymd = "20" + splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
    var dmy = splitDate[0] + "-" + splitDate[1] + "-" + "20" + splitDate[2];
    var date = new Date(ymd);
    var month = date.getMonth(); 
    var weekday = date.toLocaleString(undefined, {weekday: 'short'}).toUpperCase();
    var speed = parseFloat((row.distance * 60) / row.duration).toFixed(2);

    return {
        day: dmy,
        date: date,
        duration: +row.duration,
        distance: +row.distance,
        speed: +speed,
        month: month,
        weekday: weekday
    };
  },
  function(error, data) {
    if(error) throw error;

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

    var maxDistance = d3.max(data, d => d.distance);
    d3.select("#longest-distance").text(maxDistance + " km");

    var maxSpeed = d3.max(data, d => d.speed);
    d3.select("#max-speed").text(maxSpeed + " km/h");
 
    /* bar */

    var width = 300;
    var height = 400;

    //createBar(width, height);
    //drawBar(data);

    /* scatter */ 

    width = 790;
    height = 400;

    createScatter(width, height);
    drawScatter(data);

    /* pie */ 

    width = 400;
    height = 400;
   
    var weekData = getDataByWeekday(data);

    weekData.forEach(function(row) {
      row["percentage"] = parseFloat(100 * row.distance / totalDistance).toFixed(0);
    })

    createPie(width, height);
    drawPie(weekData);
    


  });