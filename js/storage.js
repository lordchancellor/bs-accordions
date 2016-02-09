/* Storage.js - Utilises the local storage API to save the collapse state of the accordions */

var accordions = document.getElementsByClassName("accordion-toggle");
var collapses = document.getElementsByClassName("accordion-body");
var states = [];

//Populate STATES with enough objects for each accordion
function buildStates() {
    for (var i = 0; i < accordions.length; i++) {
        states.push(new Object());
    }
}

//Populate STATES with the data stored in local storage
function populateStates() {
    states = localStorage.getObj("Accordions");
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
        localStorage.setObj("Accordions", states);
    }, 10);
}

//Check for accordions that were collapsed on last use and re-collapse now
function restoreState() {
    var length = accordions.length;
    
    for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
            if (states[i].parentId === accordions[j].dataset.parent) {
                if (states[i].collapsed && !accordions[j].classList.contains("collapsed")) {
                    collapseGroup(states[i].parentId);
                }
            }
        }
    }
}

function collapseGroup(id) {
    console.log("Collapsing " + id);
    $(id).collapse();
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
        //Check to make sure the local sorage contains the same number of collapses as the page. If not, re-build
        if (localStorage.getObj("Accordions").length === accordions.length) {
            console.log("I will now simulate populating sections from the local storage. HRMMHP. Done.");
            populateStates();
            console.log("Retoring States...");
            setTimeout(restoreState, 10);
        }
        else {
            buildStates();
        }
    }
    else {
        buildStates();
    }
}
else {
    console.error("Collapse persistence not possible for this browser");
}