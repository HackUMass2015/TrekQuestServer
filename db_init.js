var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./trek.db');
var json;

var table_name = "pet_info";
var pets;
//console.log(pets);
var pet;
var id;
var name;
var url;

// fs.readFile('./MockData.json', 'utf8', function (err, data) {
//     console.log("JSON Initializing...");
//     if (err) {
//         console.log("ERROR: JSON load - " + err);
//         throw err;
//     } else {
//         try {
//             json = JSON.parse(data);
//             console.log("JSON loaded successfully");
//             //console.log(json.data);

//             var mockdata = json.mockdata;
//             //console.log(mockdata);
//             pets = mockdata.pets
//             // for (i = 0; i < pets.length; i++)
//             // {
//             //   pet = pets[i];
//             //   id = pet.id;
//             //   name = pet.name;
//             //   url = pet.url;
//             //   console.log(i + ": id: " + id + ", name: " + ", url: " + url);
//             // }

//             //var pet = data["mockdata"]["pets"][0];
//             //console.log(pet);
            
//             var stmt = db.prepare("INSERT INTO " + table_name + "(name,imageUrl) VALUES (?,?)");
//             for (var i = 0; i < 10; i++) {
//                 pet = pets[i];
//                 id = pet.id;
//                 name = pet.name;
//                 url = pet.url;
//                 console.log("name: " + name + ", url: " + url);
//                 stmt.run(name, url);
//                 console.log("Row inserted");
//             }
//             stmt.finalize();

//             db.each("SELECT rowid AS id, name, imageUrl FROM " + table_name, function(err, row) {
//                 console.log(row.id + ": " + row.name + ", " + row.imageUrl);
//             });

//         }
//         catch (ex) {
//             console.log("ERROR: JSON parse - " + err);
//         }
//     }
//     console.log("JSON initialized!");

//     db.close(function() {
//       console.log("Database Closed");
//     });
// });

db.serialize(function() {
  console.log("Database Serialization Initializing...");

  //Setting up info tables
  setupTable("users", "(id TEXT, username TEXT)");
  setupTable("teams", "(id TEXT, name TEXT, max INTEGER)");
  setupTable("locs", "(id TEXT, ta_id INTEGER)");
  setupTable("games", "(id TEXT, author_id TEXT, start INTEGER, end INTEGER, points INTEGER)");

  //Setting up mapping tables
  setupTable("users_teams_map", "(user_id TEXT, team_id TEXT)");
  setupTable("games_locs_map", "(game_id TEXT, loc_id)");
  setupTable("games_teams_map", "(game_id TEXT, loc_id)")

  testUsers();
  testTeams();
  testLocations();

  console.log("Tables initialized!");
});

function testUsers() {
	var stmt = db.prepare("INSERT INTO users VALUES (?, ?)");
	for (var i = 0; i < 10; i++) {
	  stmt.run("device-" + i, "username " + i);
	}
	stmt.finalize();

	db.each("SELECT id, username FROM users", function(err, row) {
	  console.log(row.id + ": " + row.username);
	});
}

function testTeams() {
	var stmt = db.prepare("INSERT INTO teams VALUES (?, ?, ?)");
	for (var i = 0; i < 10; i++) {
	  stmt.run("team-" + i, "team-name " + i, i);
	}
	stmt.finalize();

	db.each("SELECT id, name, max FROM teams", function(err, row) {
	  console.log(row.id + ": " + row.name + ", " + row.max);
	});
}

function testLocations() {
	var stmt = db.prepare("INSERT INTO locs VALUES (?, ?)");
	for (var i = 0; i < 10; i++) {
	  stmt.run("location-" + i, i);
	}
	stmt.finalize();

	db.each("SELECT rowid AS num, ta_id FROM locs", function(err, row) {
	  console.log(row.num + ": " + row.ta_id);
	});
}

function setupTable(table_name, columns) {
	console.log("Setting up " + table_name + "...");

	db.run("DROP TABLE IF EXISTS " + table_name);
	db.run("CREATE TABLE " + table_name + " " + columns);

	console.log("Table " + table_name + " initialized!");
}