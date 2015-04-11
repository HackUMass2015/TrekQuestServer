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

  db.run("DROP TABLE IF EXISTS users");
  db.run("CREATE TABLE users (id TEXT, username TEXT)");

  var stmt = db.prepare("INSERT INTO lorem VALUES (?, ?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("device " + i, "username " + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS num, id, username FROM users", function(err, row) {
      console.log(row.num + ": " + row.id + ", " + row.username);
  });

  console.log("Table users initialized!");

  
});