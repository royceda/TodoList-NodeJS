var express = require('express');
var cookieSession = require('cookie-session');
var request = require('request');
var fs = require('fs');
var jf = require('jsonfile');
var bodyParser = require('body-parser');
//var request = require('sync-request');

var urlencodedParser = bodyParser.urlencoded({ extended: false});


var app = express();
console.log("Todo list with NodeJS");

app.use(cookieSession({
  name: 'session Test',
  keys: ['secret'],
  data: 'hello world',
}))
.use((req,res, next) => {
  if(typeof(req.session.todolist) == 'undefined'){
    req.session.todolist = [];
  }
  next();
});

app.get('/home', (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  req.session.name = "todo list";
  console.log(req.session)
  var data = {};


  var url = 'http://ip-api.com/json/208.80.152.201';

  request({
    url: url,
    json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200) {
      console.log(body) // Print the json response
      req.sessionOptions.lon = body.lon;
      req.sessionOptions.lat = body.lat;
    }
  })


  console.log(req.sessionOptions.lon);
  console.log(req.sessionOptions.lat);


  res.render('index.ejs', {list: req.session.todolist,
    address: ip,
    data: req.session.name,
    lon: req.sessionOptions.lon,
    lat: req.sessionOptions.lat});
  })



  .post('/todo/add/', urlencodedParser, (req, res) => {
    if(req.body.task != ''){
      console.log("Task "+req.body.task + " Added");
      req.session.todolist.push(req.body.task);
    }
    res.redirect('/home');
  })

  .get('/todo/delete/:id', (req,res) => {
    //deleting
    if(req.params.id != ''){
      req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/home');
  })

  .use((req, res, next) => {
    res.redirect('/home');
  });

  console.log("The magic port is 8888");
  app.listen(process.env.PORT || 8888);
