var http = require('http')
  , fs = require('fs')
  , sqlite3 = require('sqlite3')
  , url = require('url')
  , port = 8080;

var data = [];
var db = new sqlite3.Database("test.db");

var server = http.createServer(function (req, res) {
  var uri = url.parse(req.url);

  switch (uri.pathname) {
    case '/':
      sendFile(res, 'index.html');
      break;
    case '/index.html':
      sendFile(res, 'index.html');
      break;
      case '/data':
        break;
    case '/addNew': //sends entire pet data
      var body = '';
      req.on('data', function (data) {
        body += data;
      });
      req.on('end', function () {
        AddDB(body, res);
      });
      break;
    case '/edit':
      var body = '';
      req.on('data', function (data) {
        body += data;
      });
      req.on('end', function () {
        EditDB(body, res);
      });
      break;
    case '/getAll':
      data = [];
      db.each("SELECT ID, Name, Description, Location, Type, Closed, PlaceSafe, SurroundingSafe FROM location", function (err, row) {
        data.push(row);
        console.log(data)
      }, function () {
        removeClosed(data);
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify(data));
      });
      break;
    default:
      res.end('404 not found');
  }
});

server.listen(process.env.PORT || port);
console.log('listening on 8080');

// subroutines
function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';

  fs.readFile(filename, function (error, content) {
    res.writeHead(200, { 'Content-type': contentType });
    res.end(content, 'utf-8')
  })

}

function AddDB(body, res) {
  //console.log(JSON.parse(body))
  body = JSON.parse(body);
  db.run("INSERT INTO location(ID, Name, Description, Location, Type, Closed, PlaceSafe, SurroundingSafe )  VALUES(?,?,?,?,?,?,?,?)", body.ID, body.Name, body.Description, body.Location, body.Type, body.Closed, body.PlaceSafe, body.SurroundingSafe);
  res.writeHead(
    200,
    { 'Content-type': 'text/html' }
  );
  res.end('post recieved');
}

function EditDB(body, res) {
  body = JSON.parse(body);
  var sqledit = 'UPDATE location SET ID = ?, Name = ?, Description = ?, Location = ?, Type = ?, Closed = ?, PlaceSafe = ?, SurroundingSafe = ? WHERE ID = ?';
  db.run(sqledit, body.ID, body.Name, body.Description, body.Location, body.Type, body.Closed, body.PlaceSafe, body.SurroundingSafe, function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);
  });
  res.writeHead(
    200,
    { 'Content-type': 'text/html' }
  );
  res.end('post recieved');
}

function averageRating(){

}


function removeClosed(data){
  let tempData = [];
  for (let i = 0; i <data.length; i++) {
    if (data[i].Closed == true) {
      tempData.push(data[i]);
    }
  }
  return tempData;
}