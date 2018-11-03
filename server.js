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
    case '/map.html':
      sendFile(res, 'map.html');
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
    case '/editRating':
      var body = '';
      req.on('data', function (data) {
        body += data;
      });
      req.on('end', function () {
        editRating(body, res);
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
  db.run("INSERT INTO location(ID, Name, Description, Location, Type, Closed, PlaceSafe, SurroundingSafe )  VALUES(?,?,?,?,?,?,?,?)", body.ID, body.Name, body.Description, body.Location, body.Type, body.Closed, 0, 0);
  db.run("INSERT INTO ratings(ID, Name, SumP, TotalP, SumS, TotalS )  VALUES(?,?,?,?,?,?)", body.ID, body.Name, 0, 0,0, 0);

  res.writeHead(
    200,
    { 'Content-type': 'text/html' }
  );
  res.end('post recieved');
}

function EditDB(body, res) {
  body = JSON.parse(body);
  var sqledit = 'UPDATE location SET  Name = ?, Description = ?, Location = ?, Type = ?, Closed = ? WHERE ID = ?';
  //let average = averageRating(body);
  db.run(sqledit, body.Name, body.Description, body.Location, body.Type, body.Closed, body.ID, function (err) {
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
  console.log("Edit Rating")
  body = JSON.parse(body);
  let average = averageRating(body, res);
  /*
  */
}

function averageRating(body, res) {
  var car =[];
  var ID = body.ID;
  db.each("SELECT * FROM ratings", function (err, row) {
    if (err) {
      return console.error(err.message);
    }
    car.push(row);
  }, function () {
    let temp;
    for (let i = 0; i < car.length; i++) {
      if (car[i].ID == ID) {
        temp = car[i];
      }
    }

    let curr = temp;
    curr.SumP = curr.SumP + parseInt(body.PlaceSafe);
    curr.TotalP++;
    curr.SumS = parseInt(curr.SumS) + parseInt(body.SurroundingSafe);
    curr.TotalS++;
    var sqleditRating = 'UPDATE ratings SET SumP = ?, TotalP = ?, SumS = ?, TotalS = ? WHERE ID = ?';
    db.run(sqleditRating,  curr.SumP, curr.TotalP, curr.SumS, curr.TotalS, ID, function (err) {
      if (err) {
        return console.error(err.message + "Rating");
      }
    });
    
    let averageP = curr.SumP / curr.TotalP;
    let averageS = curr.SumS / curr.TotalS;
    averageP = round(averageP, 2);
    averageS = round(averageS, 2);

    //return {averageP, averageS};
    var sqledit = 'UPDATE location SET PlaceSafe = ?, SurroundingSafe = ? WHERE ID = ?';
    db.run(sqledit,  averageP, averageS, ID, function (err) {
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
  })
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
  var curr = [];
  db.each("SELECT ID, Name, Description, Location, Type, Closed, PlaceSafe, SurroundingSafe FROM location", function (err, row) {
    if (err) {
      return console.error(err.message);
    }
    curr.push(row);
  }, function () {
    let temp;
    for (let i = 0; i < curr.length; i++) {
      if (curr[i].ID == ID) {
        temp = curr[i];
      }
    }
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(temp));
  });
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}