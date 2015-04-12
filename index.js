var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var sqlite3	= require('sqlite3').verbose();
var dbName = './trek.db';
var db = new sqlite3.Database(dbName);
var request = require('request');

var googleMapsApi = 'http://maps.googleapis.com/maps/api/geocode/json?address=';

var tripAdvisorKey = '?key=HackUMass-93b8e93cda61';
var tripAdvisorApi = 'http://api.tripadvisor.com/api/partner/2.0/map/';

var tripAdvisorLocationPrefix = 'http://api.tripadvisor.com/api/partner/2.0/location/';

var tripAdvisorAttractionsSuffix = '/attractions' + tripAdvisorKey;
var tripAdvisorPhotoSuffix = '/photos' + tripAdvisorKey;


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

var zipcode;
var location_id;
var image;
var response;
//Get a location if it exists. Creates a new one if not
app.get('/loc', function(req, res){
	console.log(req.body);

	zipcode = req.body.zipcode;
	response = res;
	getLangLong();
});

function getLangLong(){
	//Gets Lat-Long from zipcode
	request(googleMapsApi + zipcode, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			var results = json['results'][0];
			var geometry = results['geometry'];
			var location = geometry['location'];
			var lat = location.lat;
			var lng = location.lng;
			var latlng = lat + "," + lng;
			//console.log("Latitude and Longitude for " + zipcode + ": " + latlng); // Show the HTML for the Google homepage.

			getTALocID(latlng);
		}
	});
}

//Gets tripadvisor locations from lat-long
function getTALocID(latlng){
	request(tripAdvisorApi + latlng + tripAdvisorKey, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			var data = json['data'][0];
			var ancestors = data['ancestors'][0];
			location_id = ancestors['location_id'];
			//console.log("location_id: " + location_id);

			getImage(location_id);
		}
	});
}

function getImage(){
	request(tripAdvisorLocationPrefix + location_id + tripAdvisorPhotoSuffix, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			var data = json['data'][0];
			var thumbnail = data['images']['thumbnail'];
			image = thumbnail['url'];
			//console.log("image: " + image);
			locResponse();
		}
	});
}

function locResponse(){
	var stmt = db.prepare("INSERT OR IGNORE INTO locs (location_id,zipcode,image) VALUES (?, ?, ?)");
	stmt.run(location_id, zipcode, image);
	stmt.finalize();

	getAttractions();

	var json = JSON.stringify({ value: location_id});
	//console.log(json);

	response.type('text/plain');
	response.send(json);
}

//Get attractions for a given zip code.
// app.get('/attractions', function (req, res){
// 	console.log(req.body);

// 	zipcode = "\"" + req.body.zipcode + "\"";

// 	response = res;
// 	getAttractions();
// });

function getAttractions (){
	db.get("SELECT location_id FROM locs WHERE zipcode = " + zipcode, function (error, row) {
		request(tripAdvisorLocationPrefix + row.location_id + tripAdvisorAttractionsSuffix, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var data = json['data'][0];
				json['data'].forEach(function (attraction){
					location_id = attraction['location_id'];
					console.log(location_id);
					var stmt = db.prepare("INSERT OR IGNORE INTO attractions (location_id, zipcode) VALUES (?, ?)");
					stmt.run(location_id, zipcode);
					stmt.finalize();
				});
				//console.log("image: " + image);
				//locResponse();
				//attractionResponse();
				
			}
		});
	});
}

// function attractionResponse (){
// 	db.all("SELECT location_id FROM attractions WHERE zipcode = " + zipcode, function (error, rows) {
// 		var json = JSON.stringify(rows);

// 		response.type('text/plain');
// 		response.send(location_id);
// 	});
// }

//Returns json of all games in a given zip code
app.get('/localGames', function(req, res){
	console.log(req.body['zipcode']);
	var zipcode = "\"" + req.body.zipcode +  "\"";

	db.all("SELECT id, end, points, image FROM (games INNER JOIN locs ON games.zipcode = locs.zipcode) WHERE games.zipcode = " + zipcode, function (err, rows) {
		var json = JSON.stringify(rows);

		res.type('text/plain');
  		res.send(json);
	});
});

//Returns json of all games
app.get('/games', function(req, res){
	var json;
	db.all("SELECT id, zipcode, end, points FROM games", function(err, rows) {
		console.log(rows);
		json = JSON.stringify(rows);
		console.log(json);

		res.type('text/plain');
  		res.send(json);
	});
});

//Returns json of all locations
app.get('/locs', function(req, res){
	var json;
	db.all("SELECT location_ id, zipcode, image FROM locs", function(err, rows) {
		console.log(rows);
		json = JSON.stringify(rows);
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