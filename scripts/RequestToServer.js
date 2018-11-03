

// Get data to update table
var addRequest = new XMLHttpRequest();
var editRequest = new XMLHttpRequest();
var getRequest = new XMLHttpRequest();

getData();
addRequest.onload = function() {
    if (this.readyState === 4 && this.status === 200) {
        getData();
    }
};

editRequest.onload = function() {
    if (this.readyState === 4 && this.status === 200) {
        getData();
    }
};

getRequest.onload = function() {
    if (this.readyState === 4 && this.status === 200) {
        var data = JSON.parse(this.responseText);
        if (data.length > 0) {
            console.log("Here")
            displayData(data);
        }
    }
};

function addData(JSONObj) {
    addRequest.open("POST", "/addNew");
    addRequest.send(JSON.stringify(JSONObj));
}

function editData(JSONObj) {
    editRequest.open("POST", "/edit");
    editRequest.send(JSON.stringify(JSONObj));
}

function getData() {
    getRequest.open("GET", "/getData");
    getRequest.send();
}

function displayData(data) {
    var i, template;
    var tableToPopulate  = document.getElementById("result");
    var columnLabels = document.getElementById("labels").innerHTML;

    tableToPopulate.innerHTML = "";
    tableToPopulate.innerHTML += columnLabels;

    for (i = 0; i < data.length; i++) {
        template =
            `<tr id="${data[i].ID}"><td>${data[i].Name}</td><td>${data[i].Location}</td><td>${data[i].Description}</td><td>${data[i].Type}</td><td>${data[i].PlaceSafe}</td><td>${data[i].SurroundingSafe}</td></tr>`;
        tableToPopulate.innerHTML += template;
    }
}

