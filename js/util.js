'use strict';

(function () {
  window.util = (function () {

    return {
      getRandomIndex: function (min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
      },
      getUniquePart: function (array) {
        var index = window.util.getRandomIndex(0, array.length - 1);
        return array.splice(index, 1);
      },
      isEscEvent: function (evt, action) {
        if (evt.keyCode === window.ESC_KEYCODE) {
          action();
        }
      },
      isEnterEvent: function (evt, action) {
        if (evt.keyCode === window.ENTER_KEYCODE) {
          action(evt);
        }
      }
    };
  })();
})();
