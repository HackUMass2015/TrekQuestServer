var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var sqlite3	= require('sqlite3').verbose();
var dbName = './trek.db';

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/user', function(req, res){
	console.log(req.body);

	var db = new sqlite3.Database(dbName);

	var stmt = db.prepare("INSERT INTO users VALUES (?, ?)");
	stmt.run(req.body.id, req.body.name);
	stmt.finalize();

	console.log("Added User");
	
	db.each("SELECT id, username FROM users", function(err, row) {
	  console.log(row.id + ": " + row.username);
	});
	
	db.close();
	res.send(req.body);
});

var server = app.listen(80, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});