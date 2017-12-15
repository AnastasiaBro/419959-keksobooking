'use strict';

(function () {
  var URL = 'https://1510.dump.academy/keksobooking';

  function result(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          onError('Неверный запрос, попробуйте ввести корректные данные');
          break;
        case 401:
          onError('Пользователь не авторизован');
          break;
        case 404:
          onError('Ничего не найдено');
          break;
        default:
          onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Что-то пошло не так! Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    return xhr;
  }

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = result(onLoad, onError);

      xhr.open('GET', URL + '/data');
      xhr.send();
    },
    save: function (data, onLoad, onError) {
      var xhr = result(onLoad, onError);

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };
})();
