function openEditor() {
    document.getElementById("editor").style.width = "500px";
}

function closeEditor() {
    document.getElementById("editor").style.width = "0px";
    clearEditor();
}

function clearEditor() {
    var name = document.getElementById("name");
    var location = document.getElementById("location");
    var description = document.getElementById("description");
    var isClosed = document.getElementById("isClosed");

    name.value = "";
    location.value = "";
    description.value = "";
    isClosed.checked = false;
}

function populateEditor(JSONObj) {
    var name = document.getElementById("name");
    var location = document.getElementById("location");
    var description = document.getElementById("description");
    var isClosed = document.getElementById("isClosed");

    name.value = JSONObj.Name;
    location.value = JSONObj.Location;
    description.value = JSONObj.Description;

    if (JSONObj.Closed === 1) {
        isClosed.checked = true;
    }
}

function updateChangesFromEditor() {
    var name = document.getElementById("name");
    var location = document.getElementById("location");
    var description = document.getElementById("description");
    var isClosed = document.getElementById("isClosed");

    var itemInfo = {};

    itemInfo.Name = name.value;
    itemInfo.Location = location.value;
    itemInfo.Description = description.value;

    if (isClosed.checked === true) {
        itemInfo.Closed = 1;
    } else {
        itemInfo.Closed = 0;
    }

    editData(itemInfo);
    closeEditor();
}

function openRating() {
    document.getElementById("ratings").style.width = "500px";
}

function closeRating() {
    document.getElementById("ratings").style.width = "0px";
}
function populateRatings(ID) {
    console.log("Called with ID" + ID)
}