var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var sqlite3	= require('sqlite3').verbose();
var dbName = './trek.db';
var db = new sqlite3.Database(dbName);

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

//Addes user if user doesn't exist. Updates username if user exists
app.put('/user', function(req, res){
	console.log(req.body);

	var stmt = db.prepare("INSERT OR REPLACE INTO users (id,username) VALUES (?, ?)");
	stmt.run(req.body.id, req.body.name);
	stmt.finalize();

	console.log("Added User");
	
	db.each("SELECT id, username FROM users", function(err, row) {
	  console.log(row.id + ": " + row.username);
	});

	//db.close();

	res.send(req.body);
});

app.put('/loc', function(req, res){
	console.log(req.body);

	var stmt = db.prepare("INSERT OR REPLACE INTO locs (id,username) VALUES (?, ?)");
	stmt.run(req.body.id, req.body.name);
	stmt.finalize();

	console.log("Added Location");
	
	db.each("SELECT id, username FROM locs", function(err, row) {
	  console.log(row.id + ": " + row.username);
	});

	//db.close();

	res.send(req.body);
});

var server = app.listen(80, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});