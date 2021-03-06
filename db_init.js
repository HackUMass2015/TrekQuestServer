var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./trek.db');

db.serialize(function() {
  console.log("Database Serialization Initializing...");

  //Setting up info tables
  setupTable("users", "(id TEXT UNIQUE, username TEXT)");
  setupTable("teams", "(id TEXT, name TEXT, max INTEGER)");
  setupTable("locs", "(location_id TEXT UNIQUE, zipcode TEXT, image TEXT)");
  setupTable("games", "(id TEXT, zipcode TEXT, start INTEGER, end INTEGER, points INTEGER, winnerID TEXT)");
  setupTable("attractions", "(location_id TEXT UNIQUE, zipcode TEXT)");

  //Setting up mapping tables
  setupTable("users_teams_map", "(user_id TEXT, team_id TEXT)");
  setupTable("games_locs_map", "(game_id TEXT, loc_id)");
  setupTable("games_teams_map", "(game_id TEXT, loc_id)")

  testUsers();
  testTeams();
  // testLocations();
  testGames();

  console.log("Tables initialized!");
});

function testUsers() {
	var stmt = db.prepare("INSERT INTO users VALUES (?, ?)");
	for (var i = 0; i < 2; i++) {
	  stmt.run("device-" + i, "username " + i);
	}
	stmt.finalize();

	db.each("SELECT id, username FROM users", function(err, row) {
	  console.log(row.id + ": " + row.username);
	});
}

function testTeams() {
	var stmt = db.prepare("INSERT INTO teams VALUES (?, ?, ?)");
	for (var i = 0; i < 2; i++) {
	  stmt.run("team-" + i, "team-name " + i, i);
	}
	stmt.finalize();

	db.each("SELECT id, name, max FROM teams", function(err, row) {
	  console.log(row.id + ": " + row.name + ", " + row.max);
	});
}

// function testLocations() {
	// var stmt = db.prepare("INSERT INTO locs VALUES (?, ?)");
	// for (var i = 0; i < 2; i++) {
	//   stmt.run("location-" + i, i);
	// }
	// stmt.finalize();

	// db.each("SELECT id, ta_id FROM locs", function(err, row) {
	//   console.log(row.id + ": " + row.ta_id);
	// });
//}

function testGames() {
	
	var stmt = db.prepare("INSERT INTO games VALUES (?, ?, ?, ?, ?, ?)");
	for (var i = 0; i < 12; i++) {
		var d = new Date();
		stmt.run("game-" + i, "01002", d.getTime(), d.getTime(), i*100, "1");
	}
	stmt.finalize();

	db.each("SELECT id, zipcode, start, end, points, winnerID FROM games", function(err, row) {
	  console.log(row.id + ": " + row.zipcode + ", " + row.start + ", " + row.end + ", " + row.points + ", " + row.winnerID);
	});
}

function setupTable(table_name, columns) {
	console.log("Setting up " + table_name + "...");

	db.run("DROP TABLE IF EXISTS " + table_name);
	db.run("CREATE TABLE " + table_name + " " + columns);

	console.log("Table " + table_name + " initialized!");
}

db.close(function() {
      console.log("Database Closed");
});