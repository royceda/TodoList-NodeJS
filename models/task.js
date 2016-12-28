'use strict'
var connection = require('../config/db');


class Task{

  static all(callback){
    var test = {};
    connection.query('SELECT * from tasks',test, (err, rows, fields) => {
      if (!err){
        //console.log('Task List : ', rows);
        callback(rows);
      }else
      console.log('Error while performing Query.');
    });
  }



  static create(data, callback){
    connection.query(
      'INSERT INTO tasks SET ?',
      {content: data, created_at: new Date()},
      (err, result) => {
        if (err) throw err;
        console.log(result.insertId);
        callback(err);
      });
    }


    static delete(id, callback){
      connection.query(
        'DELETE FROM tasks WHERE id = ?',
        [id],
        (err, result) => {
          if (err) throw err;
          console.log('Deleted ' + result.affectedRows + ' rows');
          callback(err);
        });
      }




      static update(data, callback){
        conection.query(
          'UPDATE tasks SET content = ? Where ID = ?',
          [data.content, data.id],
          function (err, result) {
            if (err) throw err;

            console.log('Changed ' + result.changedRows + ' rows');
          }
        );


      }



    }



    module.exports = Task
