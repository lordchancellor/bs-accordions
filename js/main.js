/*
**  This function is very specific to the way the HTML is structured.
**  Each accordian (<a> tag) has as child nodes the three separating divs. childNodes[3] focuses in on the div containing the caret.
**  That node itself contains a single child node, the <i> tag displaying the font-awesome caret. So to target this, we are looking
**  at childNodes[0].
**    
**  Customising the markup may require a re-write of the child node structure used here.
*/

//Store an array of all accordions before we begin
var accordians = document.getElementsByClassName("accordian-toggle");

function toggleCaret() {
    for (var i = 0; i < accordians.length; i++) {
        if (accordians[i].classList.contains("collapsed")) {
            accordians[i].childNodes[3].childNodes[0].setAttribute("class", "fa fa-2x fa-caret-right");
        }
        else {
            accordians[i].childNodes[3].childNodes[0].setAttribute("class", "fa fa-2x fa-caret-down");
        }
    }
}