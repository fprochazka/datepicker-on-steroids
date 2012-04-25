/**
 * @author Filip Procházka <hosiplan@gmail.com>
 * @license LGPL
 */

(function($) {
    $.fn.setCursorPosition = function(pos) {
    var set = function (el, pos) {
      if (el.setSelectionRange) {
        el.setSelectionRange(pos, pos);
      } else if (el.createTextRange) {
        var range = el.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    }
    this.focus();
    var el = this[0];
    set(el, pos);
    window.setTimeout(function() { set(el, pos); }, 1); // oh, chrome...
    return this;
  }
  // http://blog.vishalon.net/index.php/javascript-getting-and-setting-caret-position-in-textarea
  $.fn.getCursorPosition = function () {
    var ctrl = this[0];
    if (document.selection) {
      ctrl.focus();
      var Sel = document.selection.createRange();
      Sel.moveStart ('character', -ctrl.value.length);
      return Sel.text.length;
    } else if (ctrl.selectionStart || ctrl.selectionStart == '0'){
      return ctrl.selectionStart; // Firefox support
    } else {
      return 0; // fucking IE
    }
  };
})(jQuery);