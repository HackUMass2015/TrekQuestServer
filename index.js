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

//Adds user if user doesn't exist. Updates username if user exists
app.put('/user', function(req, res){
	console.log(req.body);

	var stmt = db.prepare("INSERT OR REPLACE INTO users (id,username) VALUES (?, ?)");
	stmt.run(req.body.id, req.body.name);
	stmt.finalize();

	console.log("Added User");
	
	db.each("SELECT id, username FROM users", function(err, row) {
	  console.log(row.id + ": " + row.username);
	});

	res.send(req.body);
});

//Adds location if location doesn't exist. Replaces location if exists
app.put('/loc', function(req, res){
	console.log(req.body);

	var stmt = db.prepare("INSERT OR REPLACE INTO locs (id,ta_id) VALUES (?, ?)");
	stmt.run(req.body.id, req.body.name);
	stmt.finalize();

	console.log("Added Location");
	
	db.each("SELECT id, ta_id FROM locs", function(err, row) {
	  console.log(row.id + ": " + row.ta_id);
	});

	res.send(req.body);
});

app.get('/localGames', function(req, res){
	console.log(req.body);

	var json;
	var games = [];
	var i = 0;
	db.all("SELECT id, end, points FROM games WHERE zipcode = " + req.body.zipcode, function(err, rows) {  
		// rows.forEach(function (row) {  
		//     //console.log(row.imageUrl);
		//     games[i] = row.imageUrl;
		//     i++;
		//     //console.log("Url added to array");
		// });
		json = JSON.stringify(rows);
		// console.log(games.toString());
		console.log(json);

		res.type('text/plain');
  		res.send(json);
	});
});

var server = app.listen(80, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});