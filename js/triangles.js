/*
**  This function is very specific to the way the HTML is structured.
**  Each accordian (<a> tag) has as child nodes the three separating divs. childNodes[3] focuses in on the div containing the caret.
**  That node itself contains a single child node, the <i> tag displaying the font-awesome caret. So to target this, we are looking
**  at childNodes[0].
**
**  Customising the markup may require a re-write of the child node structure used here.
*/

(function() {
  //Store an array of all accordions before we begin
  var accordions = document.getElementsByClassName("accordion-toggle");

  function toggleCaret() {
      for (var i = 0; i < accordions.length; i++) {
          if (accordions[i].classList.contains("collapsed")) {
              accordions[i].childNodes[3].childNodes[0].setAttribute("class", "fa fa-2x fa-caret-right");
          }
          else {
              accordions[i].childNodes[3].childNodes[0].setAttribute("class", "fa fa-2x fa-caret-down");
          }
      }
  }

  window.toggle = toggleCaret;
})();
