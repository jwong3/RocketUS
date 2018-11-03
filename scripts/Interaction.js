function openEditEditor() {
    clearEditor();
    document.getElementById("makeChangesButton").innerHTML = "<button id='editButton' value='update' onclick='updateChangesFromEditor(0)'>Update changes</button>";
    document.getElementById("editor").style.width = "500px";
}

function openAddEditor() {
    clearEditor();
    document.getElementById("makeChangesButton").innerHTML = "<button id='addButton' value='update' onclick='updateChangesFromEditor(1)'>Add changes</button>";
    document.getElementById("editor").style.width = "500px";
}

function closeEditor() {
    document.getElementById("editor").style.width = "0px";
}

function clearEditor() {
    var name = document.getElementById("name");
    var type = document.getElementById("type");
    var location = document.getElementById("location");
    var description = document.getElementById("description");
    var isClosed = document.getElementById("isClosed");

    name.value = "";
    type.value = "n/a";
    location.value = "";
    description.value = "";
    isClosed.checked = false;
    document.getElementById("makeChangesButton").innerHTML = "";
}

function populateEditor(JSONObj) {
    var name = document.getElementById("name");
    var type = document.getElementById("type");
    var location = document.getElementById("location");
    var description = document.getElementById("description");
    var isClosed = document.getElementById("isClosed");
    var toBeEdited = document.getElementById("editButton");

    name.value = JSONObj.Name;
    type.setSelected = JSONObj.Type;
    location.value = JSONObj.Location;
    description.value = JSONObj.Description;
    toBeEdited.value = JSONObj.ID;

    if (JSONObj.Closed === 1) {
        isClosed.checked = true;
    }
}

function updateChangesFromEditor(action) {
    var name = document.getElementById("name");
    var type = document.getElementById("type");
    var location = document.getElementById("location");
    var description = document.getElementById("description");
    var isClosed = document.getElementById("isClosed");

    var itemInfo = {};

    itemInfo.Name = name.value;
    itemInfo.Type = type.value;
    itemInfo.Location = location.value;
    itemInfo.Description = description.value;

    if (isClosed.checked === true) {
        itemInfo.Closed = 1;
    } else {
        itemInfo.Closed = 0;
    }

    if (action === 1) {
        console.log("Adding to DB... ");
        console.log(JSON.stringify(itemInfo));
        addData(itemInfo);
    }

    if (action === 0) {
        console.log("Updating DB");
        var toBeEdited = document.getElementById("editButton");

        itemInfo.ID = toBeEdited.value;
        console.log(JSON.stringify(itemInfo));
        editData(itemInfo);
    }

    closeEditor();
}

function openRating() {
    document.getElementById("ratings").style.width = "500px";
}

function closeRating() {
    document.getElementById("ratings").style.width = "0px";
}
function populateRatings(JSONObj) {
    console.log("RATINGS " +JSONObj  + JSONObj.Name)
    var name = document.getElementById("NameR");
    var location = document.getElementById("LocationR");
    var description = document.getElementById("DescriptionR");

    name.innerHTML+=JSONObj.Name;
    location.innerHTML +=JSONObj.Location;
    description.innerHTML += JSONObj.Description;

}