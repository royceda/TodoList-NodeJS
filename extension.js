var request = require('request');

//global
var coord = {};



exports.coord = function (ip){
  var url   = 'http://ip-api.com/json/'+ip;
  //get coord
  request({
    url: url,
    json: true
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      //console.log(body) // Print the json response
      coord.lon = body.lon;
      coord.lat = body.lat;
    }
  })

  return coord;
}


//create package
exports.addresses = function (){
  var os = require('os');
  var interfaces = os.networkInterfaces();
  var addresses = [];
  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  return addresses
}
