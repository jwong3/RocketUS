var http = require('http')
  , fs = require('fs')
  , sqlite3 = require('sqlite3')
  , url = require('url')
  , port = 8080;

var data = [];
var db = new sqlite3.Database("locations.db");

var server = http.createServer(function (req, res) {
  var uri = url.parse(req.url);

  switch (uri.pathname) {
    case '/':
      sendFile(res, 'index.html');
      break;
    case '/index.html':
      sendFile(res, 'index.html');
      break;
    case '/info.html':
      sendFile(res, 'info.html');
      break;
    case '/scripts/table.js':
      sendFile(res, 'scripts/table.js', 'text/javascript');
      break;
    case '/scripts/RequestToServer.js':
      sendFile(res, 'scripts/RequestToServer.js', 'text/javascript');
      break;
    case '/scripts/Interaction.js':
      sendFile(res, 'scripts/Interaction.js', 'text/javascript');
      break;
    case '/css/style.css':
      sendFile(res, 'css/style.css', 'text/css');
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
    case '/getData':
      data = [];
      db.each("SELECT ID, Name, Description, Location, Type, Closed, PlaceSafe, SurroundingSafe FROM location", function (err, row) {
        data.push(row);
        console.log(data)
      }, function () {
        data = removeClosed(data);
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify(data));
      });
      break;
    case '/getItem':
      var body = '';
      req.on('data', function (data) {
        body += data;
      });
      req.on('end', function () {
        returnOneRow(body, res);
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

  console.log("Sending file index.html");
}

function AddDB(body, res) {
  //console.log(JSON.parse(body))
  body = JSON.parse(body);
  body.ID = Date.now().toString(36);
  db.run("INSERT INTO location(ID, Name, Description, Location, Type, Closed, PlaceSafe, SurroundingSafe )  VALUES(?,?,?,?,?,?,?,?)", body.ID, body.Name, body.Description, body.Location, body.Type, body.Closed, body.PlaceSafe, body.SurroundingSafe);
  res.writeHead(
    200,
    { 'Content-type': 'text/html' }
  );
  res.end('post recieved');
}

function EditDB(body, res) {
  body = JSON.parse(body);
  var sqledit = 'UPDATE location SET ID = ?, Name = ?, Description = ?, Location = ?, Type = ?, Closed = ? WHERE ID = ?';
  //let average = averageRating(body);
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

function editRating(body, res) {
  body = JSON.parse(body);
  let average = averageRating(body);
  db.run(sqledit, body.ID, body.Name, body.Description, body.Location, body.Type, body.Closed, average.averageP, average.averageS, function (err) {
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

function averageRating(body) {
  var sqlget = "SELECT * FROM ratings WHERE ID = ? ";
  var curr;
  db.run(sqlget, body.ID, function (err, row) {
    if (err) {
      return console.error(err.message);
    }
    curr = row;
  });
  curr.SumP += body.PlaceSafe;
  curr.TotalP++;
  curr.SumS += body.SurroundingSafe;
  curr.TotalS++;
  var sqleditRating = 'UPDATE ratings SET ID = ?, Name = ?, SumP = ?, TotalP = ?, SumS = ?, TotalS = ?,WHERE ID = ?';
  db.run(sqleditRating, curr.ID, curr.Name, curr.SumP, curr.TotalP, curr.SumS, curr.TotalS, function (err) {
    if (err) {
      return console.error(err.message);
    }
  });
  let averageP = curr.SumP / curr.TotalP;
  let averageS = curr.SumS / curr.TotalS;

  return averageP, averageS;

}

function removeClosed(data) {
  let tempData = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].Closed === 0) {
      tempData.push(data[i]);
    }
  }
  return tempData;
}

function returnOneRow(ID, res) {
  console.log("ID" + ID)
  //ID = JSON.parse(ID);
  var curr = [];
  db.each("SELECT ID, Name, Description, Location, Type, Closed, PlaceSafe, SurroundingSafe FROM location", function (err, row) {
    if (err) {
      return console.error(err.message);
    }
    console.log("Row" + row)
    curr.push(row);
  }, function () {
    console.log(curr.length)
    let temp;
    for (let i = 0; i < curr.length; i++) {
      if (curr[i].ID == ID) {
        temp = curr[i];
      }
    }
    console.log("CURR" + temp)
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(temp));
  });
}