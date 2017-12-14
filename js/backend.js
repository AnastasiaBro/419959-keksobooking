'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';
  window.backend = {
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();

      xhr.responseType = 'json';
      xhr.open('GET', SERVER_URL);

      xhr.addEventListener('load', function () {
        onLoad(xhr.response);
      });

      xhr.send();
    }
  };
})();
