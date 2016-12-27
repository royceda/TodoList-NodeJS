var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
fs = require('fs');


var bodyParser    = require('body-parser');
var cookieSession = require('cookie-session');


var urlencodedParser = bodyParser.urlencoded({ extended: false});
var port             = process.env.PORT || 8888

console.log("Todo list with NodeJS");

//Configure app
app.use(cookieSession({
  name: 'session Test',
  keys: ['secret'],
  data: 'hello world',
}))
.use(express.static(__dirname + '/public'))
.use((req,res, next) => {
  if(typeof(req.session.todolist) == 'undefined'){
    req.session.todolist = [];
  }
  next();
});



//Routes
app.get('/home', (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  req.session.name = "todo list";
  console.log(req.session)

  var data = {};
  var coord = require('./extension').coord(ip);

  req.sessionOptions.lon = coord.lon;
  req.sessionOptions.lat = coord.lat;

  res.render('index.ejs', {list: req.session.todolist,
    address: ip,
    data: req.session.name,
    lon: req.sessionOptions.lon,
    lat: req.sessionOptions.lat,
    ip: require('./extension').addresses()[0],
    port:  port});
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
  .get('/chat', (req,res) => {
    res.render('chat.ejs', {port: port});
  })
  .use((req, res, next) => {
    res.redirect('/home');
  });


  //Socket
  io.sockets.on('connection', (socket, name) => {

    // Once we get a username, It saves in a session variable
    socket.on('new_client', (name) => {
      console.log("new client : "+name);
      socket.name = ent.encode(name);
      //socket.name = name;
      socket.broadcast.emit('new_client', name);
    });


    // Once a message is received, we broadcast
    socket.on('message', (message) => {
      console.log("message : "+message)
      message = ent.encode(message);
      socket.broadcast.emit('message', {name: socket.name, message: message});
    });
  });



  console.log("The magic port : "+port);
  server.listen(port);
