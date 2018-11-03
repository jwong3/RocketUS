function openEditEditor() {
    document.getElementById("makeChangesButton").innerHTML = "<button id='editButton' value='update' onclick='updateChangesFromEditor()'>Update changes</button>";
    document.getElementById("editor").style.width = "500px";
}

function openAddEditor() {
    document.getElementById("makeChangesButton").innerHTML = "<button id='addButton' value='update' onclick='closeEditor()'>Add changes</button>";
    document.getElementById("editor").style.width = "500px";
}

function closeEditor() {
    clearEditor();
    document.getElementById("editor").style.width = "0px";
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
    document.getElementById("makeChanges").innerHTML = "";
}

function populateEditor(JSONObj) {
    var name = document.getElementById("name");
    var location = document.getElementById("location");
    var description = document.getElementById("description");
    var isClosed = document.getElementById("isClosed");
    var toBeEdited = document.getElementById("editButton");

    name.value = JSONObj.Name;
    location.value = JSONObj.Location;
    description.value = JSONObj.Description;
    toBeEdited.value = JSONObj.ID;

    if (JSONObj.Closed === 1) {
        isClosed.checked = true;
    }
}

function updateChangesFromEditor(action) {
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

    if (action === 'add') {
        addData(itemInfo);
    }

    if (action === 'edit') {
        var toBeEdited = document.getElementById("editButton");

        itemInfo.ID = toBeEdited.value;
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