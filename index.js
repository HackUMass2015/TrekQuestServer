var express = require('express');
var app = express();
var sqlite3	= require('sqlite3').verbose();
var dbName = './trek.db';

app.use(express.bodyParser());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.put('/user', function(req, res){
	console.log(req.body);

	var stmt = db.prepare("INSERT INTO users VALUES (?, ?)");
	for (var i = 0; i < 10; i++) {
	  stmt.run("device-" + i, "username " + i);
	}
	stmt.finalize();

	db.each("SELECT id, username FROM users", function(err, row) {
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