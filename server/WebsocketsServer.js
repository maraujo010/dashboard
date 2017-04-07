const WebSocket = require('ws');
const port      = 8080;
const wss       = new WebSocket.Server({ port: port });

// generate a random integer
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generate random lon lat point
function getRandomLonLat(lat, lon, meters)
{
  var r = meters/111300
  var y0 = lat
  ,   x0 = lon
  ,    u = Math.random()
  ,    v = Math.random()
  ,    w = r * Math.sqrt(u)
  ,    t = 2 * Math.PI * v
  ,    x = w * Math.cos(t)
  ,   y1 = w * Math.sin(t)
  ,   x1 = x / Math.cos(y0)

  newLat = y0 + y1
  newLon = x0 + x1

  return [newLat, newLon]
}


wss.on('connection', function connection(ws) {

  // creating random fake info for demo purposes

  wss.clients.forEach(function each(client) {

    if (client.readyState === WebSocket.OPEN) {
      var counter = 0;
      var i = setInterval(function(){

        var idCompany = getRandomInt(1,10);
        var idDriver  = getRandomInt(1,100);
        var timeStmp  = new Date().toISOString();
        var speed     = 123.45;
        var accu      = 12.0;

        newLatLon = getRandomLonLat(52.234234, 13.23324, 5000);

        var lat       = newLatLon[0];
        var lon       = newLatLon[1];

        var driverInfoObj = {
          'company_id':idCompany,
          'driver_id':idDriver,
          'timestamp':timeStmp,
          'latitude':lat,
          'longitude':lon,
          'accuracy':accu,
          'speed':speed
        };

        ws.send(JSON.stringify(driverInfoObj), function (error){ /* ignore errors */ });

        counter++;

        // demo: sending 500000 datasets
        if(counter === 50000) {
            clearInterval(i);
        }
      }, 2000);
    }
  });
});

console.log("Websockets server started on port:" + port)
