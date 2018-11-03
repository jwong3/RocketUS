

// Get data to update table
var addRequest = new XMLHttpRequest();
var editRequest = new XMLHttpRequest();
var getRequest = new XMLHttpRequest();
var getItemRequest = new XMLHttpRequest();

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
            console.log("Here");
            displayData(data);
        }
    }
};

getItemRequest.onload = function() {
    if (this.readyState === 4 && this.status === 200) {
        populateEditor(JSON.parse(this.responseText));
        openEditEditor();
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
    console.log("getdata")
    getRequest.open("GET", "/getData");
    getRequest.send();
}

function getItemInfo(id) {
    var itemId = {ID: id};

    getItemRequest.open("POST", "/getItem");
    getItemRequest.send(itemId);
}

function displayData(data) {
    var i, template;
    var tableToPopulate  = document.getElementById("result");
    var columnLabels = document.getElementById("labels").innerHTML;

    tableToPopulate.innerHTML = "";
    tableToPopulate.innerHTML += columnLabels;

    for (i = 0; i < data.length; i++) {
        template =
            `<tr id="${data[i].ID}" onclick="getItemInfo('${data[i].ID}')"><td>${data[i].Name}</td><td>${data[i].Location}</td><td>${data[i].Description}</td><td>${data[i].Type}</td><td>${data[i].PlaceSafe}</td><td>${data[i].SurroundingSafe}</td><td><button onclick ="openRating(); populateRatings('${data[i].ID}')">AddRating</button> </td></tr>`;
        tableToPopulate.innerHTML += template;
    }
}

