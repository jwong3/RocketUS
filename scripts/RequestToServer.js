

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

    tableToPopulate.innerHTML = "";

    for (i = 0; i < data.length; i++) {
        template =
            `<tr id="${data[i].id}"><td>${data[i].name}"</td><td>${data[i].location}"</td><td>${data[i].description}"</td><td>${data[i].type}"</td><td>${data[i].placeSafety}"</td><td>${data[i].locationSafety}"</td></tr>"`;
        tableToPopulate += template;
    }
}

