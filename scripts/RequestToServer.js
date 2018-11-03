// Get data to update table
var getRequest = new XMLHttpRequest();

getRequest.onload = function() {
    if (this.readyState === 4 && this.status === 200) {
        displayData(JSON.parse(this.responseText));
    }
}

function getData() {
    getRequest.open("GET", "/data");
    getRequest.send();
}

function displayData(data) {
    var i;
    var tableToPopulate  = document.getElementById("result");

    tableToPopulate.innerHTML = "";

    for (i = 0; i < data.length; i++) {
        var template =
            `<tr id="${data[i].id}"><td>${data[i].name}"</td><td>${data[i].location}"</td><td>${data[i].description}"</td><td>${data[i].type}"</td><td>${data[i].placeSafety}"</td><td>${data[i].locationSafety}"</td></tr>"`;
        tableToPopulate += template;
    }
}