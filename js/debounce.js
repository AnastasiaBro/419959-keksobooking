'use strict';

(function () {
  var lastTimeout;

  window.debounce = function (callback) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(callback, window.constants.DEBOUNCE_INTERVAL);
  };
})();
