var mysql      = require('mysql2');

//With docker host
var connection = mysql.createConnection({
  host     : '172.17.0.2',
  user     : 'root',
  password : 'root',
  database : 'todolist'
});


connection.connect((err) => {
    if(err) throw err;
    console.log("connected");
});


//test
connection.query('SELECT * from tasks', function(err, rows, fields) {
  if (err)
    //console.log('Task List : ', rows);
    console.log('Error while performing Query.');
});



module.exports = connection;


//connection.end();

/*
var sql = "SELECT * FROM ?? WHERE ?? = ?";
var inserts = ['tasks', 'id', userId];
sql = mysql.format(sql, inserts);
*/
