var today = new Date();
var todayDay = today.toLocaleString(undefined, {weekday: 'short'}).toUpperCase();

var orderedWeekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
var month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

var lastModifiedDate = "";
var dataFile = "./data/exercise_data.csv";

fetch(dataFile).then(function(response) {
  lastModifiedDate = response.headers.get('Last-Modified').substr(5,17);
  d3.select(".last-modified").text(lastModifiedDate) // add to DOM
});

d3.csv(dataFile, function(row, i, headers) {
    // formatter function
    var splitDate = row.day.split("/")
    var ymd = "20" + splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
    var dmy = splitDate[0] + "-" + splitDate[1] + "-" + "20" + splitDate[2];
    var date = new Date(ymd);
    var monthNum = date.getMonth();
    var monthYear = month[monthNum] + "'" + date.getFullYear().toString().substr(2,4);
    var weekday = date.toLocaleString(undefined, {weekday: 'short'}).toUpperCase();
    var speed = parseFloat((row.distance * 60) / row.duration).toFixed(2);

    return {
        day: dmy,
        date: date,
        duration: +row.duration,
        distance: +row.distance,
        speed: +speed,
        month: month[monthNum],
        weekday: weekday,
        monthYear: monthYear
    };
  },
  function(error, data) {
    if(error) throw error;

    /* stats */ 

    var lastrow = data[data.length-1];

    if(lastrow.date.setHours(0,0,0,0) === today.setHours(0,0,0,0)) {
        d3.select("#today-distance").text(lastrow.distance + " km");
        d3.select("#today-speed").text(lastrow.speed + " km/h");
    } 

    var monthData = data.filter(d => (d.date.getMonth() === today.getMonth()) & (d.date.getYear() === today.getYear()));
    var monthDistance = d3.sum(monthData, d => d.distance);
    var monthSpeed = 0;
    if(monthDistance !== 0) {
      monthSpeed = parseFloat(d3.mean(monthData, d => d.speed)).toFixed(2);
    }
    d3.select("#month-distance").text(monthDistance + " km");
    d3.select("#month-speed").text(monthSpeed + " km/h");

    var totalDistance = parseFloat(d3.sum(data, d => d.distance)).toFixed(2);
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

    var monthData = getDataByMonth(data);

    drawBar(400, 400, monthData);

    /* scatter */ 

    createScatter(800, 400);
    drawScatter(data);

    /* pie */ 
   
    var weekData = getDataByWeekday(data);

    weekData.forEach(function(row) {
      row["percentage"] = parseFloat(100 * row.distance / totalDistance).toFixed(0);
    })

    createPie(400, 400);
    drawPie(weekData);    

  });