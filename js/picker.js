/**
 * @author Filip Procházka <hosiplan@gmail.com>
 * @license LGPL
 */

$(document).ready(function () {
  var dateInputValidator = function (el) {
    var name = el.attr('class'), val = parseInt(el.val());
    if (val < 1)  {
      el.val("1");
      return false;
    } else if (name === "day") {
      if (val > 31) {
        el.val("31");
        return false;
      }
    } else if (name === "month") {
      if (val > 12) {
        el.val("12");
        return false;
      }
    }
    return true;
  };
  var mergeInputs = function (el) {
    return el.find('input.day').val()
      + '.' + el.find('input.month').val()
      + '.' + el.find('input.year').val();
  };
  // build inputs
  $('input[type="date"]').each(function () {
    var input = $(this);
    var format = input.data('date-format')
      .replace(/([^a-z0-9]+)/g, " $1")
      .replace(/dd/i, '<input type="number" class="day" maxlength="2" />')
      .replace(/mm/i, '<input type="number" class="month" maxlength="2" />')
      .replace(/yy/i, '<input type="number" class="year" maxlength="2" />');
    var picker = $('<span class="datepicker"></span>')
      .append(format);
    var setDate = function(inst) {
      picker.find('.day').val(parseInt(inst.selectedDay).toString());
      picker.find('.month').val((parseInt(inst.selectedMonth)+1).toString());
      picker.find('.year').val(parseInt(inst.selectedYear).toString());
    };
    // create datepicker icon
    input.datepicker({
      showOn: "button",
      dateFormat: input.data('date-format'),
      buttonImage: "calendar.gif",
      buttonImageOnly: true,
      onClose: function(dateText, inst) {
        setDate(inst);
      }
    });
    var pickerUi = input.data("datepicker");
    input.datepicker('getDate'); // load date
    setDate(pickerUi);
    // replace with numer inputs
    input.after(picker);
    input.addClass('hidden-input');
    picker.data('date-input', input);
    var inputs = picker.find('input');
    // bind events
    inputs.bind('mousewheel', function(event) {
      var delta = event.originalEvent.wheelDelta;
      var val = parseInt($(this).val());
      $(this).val(val + (delta > 0 ? 1 : -1));
      dateInputValidator($(this));
      input.val(mergeInputs(picker));
      return false;
    }).bind('click', function (event) {
      $(this).select();
    }).bind('keyup', function (event) {
      dateInputValidator($(this));
      input.val(mergeInputs(picker));
    }).bind('keydown keypress', function (event) {
      var part = $(this);
      if (event.type === "keypress") {
        var keyCode = event.keyCode || event.charCode;
        var strChar = String.fromCharCode(keyCode);
        if (!/^\d+$/.test(strChar)) {
          var nextPart = part.next('input');
          if (nextPart.length == 1) {
            nextPart.setCursorPosition(0);
            nextPart.select();
            window.setTimeout(function() {
              nextPart.select();
            }, 1);
          }
          return false;
        }
      } else if (event.type === "keydown") {
        if (!dateInputValidator(part)) {
          input.val(mergeInputs(picker));
          return false;
        }
      }
      if (event.which == 39) {
        var nextPart = part.next('input');
        if (nextPart.length == 1 && $(event.target).getCursorPosition() == part.val().toString().length) {
          nextPart.setCursorPosition(0);
          nextPart.select();
          window.setTimeout(function() {
            nextPart.select();
          }, 1);
        }
      } else if (event.which == 37) {
        var prevPart = part.prev('input');
        if (prevPart.length == 1 && $(event.target).getCursorPosition() == 0) {
          prevPart.setCursorPosition(prevPart.val().toString().length);
          prevPart.select();
          window.setTimeout(function() {
            prevPart.select();
          }, 1);
        }
      }
    });
  });
});