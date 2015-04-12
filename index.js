var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var sqlite3	= require('sqlite3').verbose();
var dbName = './trek.db';
var db = new sqlite3.Database(dbName);
var request = require('request');
var googleMapsApi = 'http://maps.googleapis.com/maps/api/geocode/json?address='

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

//Get a location if it exists. Creates a new one if not
app.get('/loc', function(req, res){
	console.log(req.body);
	var location;
	var lat;
	var lng;

	request(googleMapsApi + req.body.zipcode, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			location = body;
			console.log(location);
			console.log(Object.getOwnPropertyNames(location));
			// lat = location.lat;
			// lng = location.lng;
			// console.log(lat + ", " + lng) // Show the HTML for the Google homepage. 
		}
	})



	// var stmt = db.prepare("INSERT OR REPLACE INTO locs (id,ta_id) VALUES (?, ?)");
	// stmt.run(req.body.id, req.body.name);
	// stmt.finalize();

	// console.log("Added Location");
	
	// db.each("SELECT id, ta_id FROM locs", function(err, row) {
	//   console.log(row.id + ": " + row.ta_id);
	// });

	// res.send(req.body);
});

//Returns json of all games in a given zip code
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

//Returns a given players cumulative score
app.get('/score', function(req, res){
	console.log(req.body);
	var score = 0;
	var json;
	db.all("SELECT points FROM games WHERE winnerID = " + req.body.id, function(err, rows) {  
		rows.forEach(function (row) {
		    score += row.points;
		});
		json = JSON.stringify({ value: score});
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