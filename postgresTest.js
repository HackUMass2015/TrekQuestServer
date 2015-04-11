var pg = require('pg');
var conString = "postgres://postgres:password@52.5.229.43/mydb";

console.log("Starting test...");

var client = new pg.Client(conString);
client.connect(function(err) {
  console.log("Starting connection...");
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
    client.end();
  });
});
console.log("Complete");
