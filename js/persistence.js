/* Storage.js - Utilising HTML5's local storage API to persist the collapse state of Bootstrap accordions */

var headings = document.getElementsByClassName("accordion-toggle");
var bodies = document.getElementsByClassName("accordion-body");
var states = [];
var statesLiaison = []; //This array will act as the go-between for STATES and LOCALSTORAGE

//Build STATES for the first time
function buildStates() {
    //Populate STATES with enough Objects for each collapse
    for (var i = 0; i < headings.length; i++) {
        states.push(new Object());
    }

    //Populate STATES with the current collapse state of each element
    for (var i = 0; i < headings.length; i++) {
        states[i].headingId = headings[i].dataset.parent;
        states[i].bodyId = "#" + bodies[i].id;
        states[i].collapsed = false;

        if (headings[i].classList.contains("collapsed")) {
            states[i].collapsed = true;
        }
    }
}

//Setup STATES with the data stored in LOCALSTORAGE
function populateStates() {
    //Populate STATESLIAISON with the data stored in LOCALSTORAGE
    statesLiaison = localStorage.getObj("Accordions");

    //Populate STATES with the data from elements on THIS page
    buildStates();

    //Compare STATES with STATESLIAISON and update any entries that differ
    syncStates(statesLiaison, states, "load");
}

//Sync STATESLIAISON and STATES
function syncStates(syncFrom, syncTo, direction) {
    switch (direction) {
        case "load":
            for (var i = 0; i < syncTo.length; i++) {
                for (var j = 0; j < syncFrom.length; j++) {
                    if (syncTo[i].bodyId === syncFrom[j].bodyId && syncTo[i].collapsed !== syncFrom[j].collapsed) {
                        syncTo.splice(i, 1, syncFrom[j]);
                        console.log("Updating " + syncFrom[j].bodyId + ".");
                    }
                }
            }
            break;

        case "save":
            for (var i = 0; i < syncFrom.length; i++) {
                var match = false; //Control variable for positive matches - insert a new element if no match found

                for (var j = 0; j < syncTo.length; j++) {
                    if (syncFrom[i].bodyId === syncTo[j].bodyId) {
                        console.log("Match found");
                        match = true;

                        if (syncFrom[i].collapsed !== syncTo[j].collapsed) {
                            console.log("Updating record in statesLiaison");
                            syncTo.splice(j, 1, syncFrom[i]);
                        }
                    }
                }

                //If entry does not exist in STATESLIAISON we push it to the array
                if (!match) {
                    console.log("No match found, pushing new element to statesLiaison");
                    syncTo.push(syncFrom[i]);
                    console.log("Added " + syncFrom[i].headingId + " to statesLiaison");
                }
            }
            break;

        default:
            console.error("Error in state synchronisation");
            break;
    }
}

//Refresh the 'collapsed' property of STATES on any elements that have changed state
function refreshStates() {
    for (var i = 0; i < headings.length; i++) {
        for (var j = 0; j < states.length; j++) {
            if (headings[i].dataset.parent === states[j].headingId) {
                if (headings[i].classList.contains("collapsed")) {
                    states[j].collapsed = true;
                }
                else {
                    states[j].collapsed = false;
                }
            }
        }
    }
}

//Check for elements that were collapsed in a prior session and re-collapse now
function restoreStates() {
    for (var i = 0; i < headings.length; i++) {
        for (var j = 0; j < states.length; j++) {
            if (headings[i].dataset.parent === states[j].headingId) {
                if (!headings[i].classList.contains("collapsed") && states[j].collapsed) {
                    collapseGroup(headings[i].dataset.parent, bodies[i].id);
                }
            }
        }
    }
}

//Make the necessary attribute changes to collapse an element
function collapseGroup(headingId, bodyId) {
    //Set the appropriate element in HEADINGS to a collapsed state
    for (var i = 0; i < headings.length; i++) {
        if (headings[i].dataset.parent === headingId) {
            headings[i].classList.add("collapsed");
            headings[i].setAttribute("aria-expanded", "false");
        }
    }
    
    //Set the appropriate element in BODIES to a collapsed state
    for (var j = 0; j < bodies.length; j++) {
        if (bodies[j].id === bodyId) {
            bodies[j].classList.remove("in");
            bodies[j].setAttribute("aria-expanded","false");
        }
    }
}

//Called when accordions are toggled - updates LOCALSTORAGE with the current collapse state
//Note - the function is called with a timeout, but requires an additional timeout, hence individual timeouts within the function
function updateStates() {
    setTimeout(function() { refreshStates(); }, 10);
    setTimeout(function() { syncStates(states, statesLiaison, "save"); }, 10);
    setTimeout(function() { localStorage.setObj("Accordions", statesLiaison); }, 10);
}


//Check whether local storage is available and (as a precautionary step) that HEADINGS and BODIES are equal in length
if (typeof(Storage) !== "undefined" && headings.length === bodies.length) {
    //OBJECT COMPATIBILITY FOR LOCAL STORAGE
    Storage.prototype.setObj = function(key, obj) {
        return this.setItem(key, JSON.stringify(obj));
    }
    Storage.prototype.getObj = function(key) {
        return JSON.parse(this.getItem(key));
    }

    //Check if the local storage contains any collapse data, if not then build STATES for the first time
    if (localStorage.getObj("Accordions")) {
        console.log("I will now simulate populating sections from the local storage. *HRRNNNN* Done.");
        populateStates();
        console.log("Restoring States...");
        restoreStates();
    }
    else {
        buildStates();
    }
}

else {
    console.error("Collapse persistence not available for this browser.");
}
