'use strict';

(function () {
  // сначала проверка - если не main пин И (это пин ИЛИ (это img И родитель не main))
  // потом условие, чтоб событие сработало на button
  // если при открытой карточке нажать на другую - старая закроется
  // если был активный пин - убираем ему класс active, а текущему добавляем

  function showCard(evt, array) {
    var target = evt.target;
    var element = target.getAttribute('class');
    var elementTag = target.tagName;
    var elementParent = target.parentNode.getAttribute('class');

    if (element !== 'map__pin map__pin--main' && (element === 'map__pin' || (elementTag === 'IMG' && elementParent !== 'map__pin map__pin--main'))) {
      if (target.tagName === 'IMG') {
        target = target.parentNode;
      }

      if (window.cityMap.querySelector('.map__card')) {
        var mapCard = window.cityMap.querySelector('.map__card');
        window.cityMap.removeChild(mapCard);
      }

      if (window.mapPins.querySelector('.map__pin--active')) {
        window.mapPins.querySelector('.map__pin--active').classList.remove('map__pin--active');
      }

      target.classList.add('map__pin--active');
      findRightAdvert(array);

      window.getCloseButton();
    }
  }

  function findRightAdvert(array) {
    var pinIndex;
    for (var i = 1; i <= array.length; i++) {
      if (window.mapPins.querySelectorAll('.map__pin')[i].getAttribute('class') === 'map__pin map__pin--active') {
        pinIndex = i - 1;
      }
    }

    var fragment = document.createDocumentFragment();
    fragment.appendChild(window.createOneAdvert(array[pinIndex]));
    window.cityMap.appendChild(fragment);
  }

  window.showCard = showCard;
})();
