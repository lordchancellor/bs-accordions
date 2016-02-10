/* Storage.js - Utilises the local storage API to save the collapse state of the accordions */

var accordions = document.getElementsByClassName("accordion-toggle");
var collapses = document.getElementsByClassName("accordion-body");
var states = [];
var localStates = []; //An array for holding the states as they come out of localStorage, for comparison to the existing STATES array

//Populate STATES with enough objects for each accordion
function buildStates() {
    for (var i = 0; i < accordions.length; i++) {
        states.push(new Object());
    }
}

//Populate LOCALSTATES with the data stored in local storage
function populateStates() {
    //Populate LOCALSTATES with the data stored in LOCALSTORAGE
    localStates = localStorage.getObj("Accordions");
    
    //Populate STATES with the elements found in THIS page
    buildStates();
    getStates();
    
    //Compare STATES with LOCALSTATES and update any entries that differ
    syncStates(states, localStates, "load");
}

//Sort through LOCALSTATES to find matching entries in STATES and copy the relevant data across
function syncStates(syncTo, syncFrom, direction) {
    switch (direction) {
        case "load":
            for (var i = 0; i < syncTo.length; i++) {
                for (var j = 0; j < syncFrom.length; j++) {
                    if (syncTo[i].id === syncFrom[j].id && syncTo[i].collapsed !== syncFrom[j].collapsed) {
                        syncTo.splice(i, 1, syncFrom[j]);
                        console.log("Updating " + syncFrom[j].id + ".");
                    }
                }
            }
            break;
            
        case "save":
            for (var i = 0; i < syncFrom.length; i++) {
                var match = false; //Control variable for positive matches - insert new element if no match found
                
                for (var j = 0; j < syncTo.length; j++) {
                    if (syncFrom[i].id === syncTo[j].id && syncFrom[i].collapsed !== syncTo[j].collapsed) {
                        console.log("Match found - updating record in localStates");
                        syncTo.splice(j, 1, syncFrom[i]);
                        match = true;
                    }
                    else if (syncFrom[i].id === syncTo[j].id && syncFrom[i].collapsed === syncTo[j].collapsed) {
                        //If we have a match, but the collapse state is unchanged, there is no need to update
                        match = true;
                    }
                }
                
                //If the entry does not already exist in LOCALSTATES we push it to the array
                if (!match) {
                    console.log("No match found, pushing new element to localStates");
                    syncTo.push(syncFrom[i]);
                    console.log("Added " + syncFrom[i] + " to localStates");
                }
            }
            break;
            
        default:
            console.error("Error in state synchronisation");
            break;
    }
}

//Populate STATES with the current collapse state of the accordions
function getStates() {
    for (var i = 0; i < accordions.length; i++) {
        states[i].id = collapses[i].id;
        states[i].parentId = accordions[i].dataset.parent;

        if (accordions[i].classList.contains("collapsed")) {
            states[i].collapsed = true;
        }
        else {
            states[i].collapsed = false;
        }
    }
}

//Called when accordions are toggled - updates localStorage with the current collapse state
function updateState() {
    setTimeout(getStates, 10);
    setTimeout(function() {
        syncStates(localStates, states, "save");
    }, 10);
    setTimeout(function() {
        localStorage.setObj("Accordions", localStates);
    }, 10);
}

//Check for accordions that were collapsed on last use and re-collapse now
function restoreState() {
    var length = accordions.length;

    for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
            if (states[i].parentId === accordions[j].dataset.parent) {
                if (states[i].collapsed && !accordions[j].classList.contains("collapsed")) {
                    collapseGroup('#' + states[i].id);
                }
            }
        }
    }
}

//Collapse a group - using an external function in case of closure
function collapseGroup(id) {
    console.log("Collapsing " + id);
    $(id).collapse();
    toggle();
}

//Check whether local storage is available and make sure that ACCORDIONS and COLLAPSES are the same length
//(they should all be part of the same accordion-groups - if not then there is an error with the page build and this code will fail)
if (typeof(Storage) !== "undefined" && accordions.length === collapses.length) {
    //OBJECT COMPATIBILITY FOR LOCAL STORAGE
    Storage.prototype.setObj = function(key, obj) {
        return this.setItem(key, JSON.stringify(obj));
    };
    Storage.prototype.getObj = function(key) {
        return JSON.parse(this.getItem(key));
    };

    //Check if the local storage contains any collapse data, if not build the STATES array for first use
    if (localStorage.getObj("Accordions")) {
        console.log("I will now simulate populating sections from the local storage. *HRRNNNN* Done.");
        populateStates();
        console.log("Restoring States...");
        setTimeout(restoreState, 1);
    }
    else {
        buildStates();
    }
}
else {
    console.error("Collapse persistence not possible for this browser");
}