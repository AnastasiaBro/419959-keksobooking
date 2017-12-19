'use strict';

(function () {
  // сначала проверка - если не main пин И (это пин ИЛИ (это img И родитель не main))
  // потом условие, чтоб событие сработало на button
  // потом если при открытой карточке нажать на другую - старая закроется
  // если был активный пин - убираем ему класс active
  // а текущему добавляем
  // потом вставляю правильное объявление
  // потом рассматриваю закрытие объявления здесь же, т.к. каждый раз генерируется новое объявление в дом-дереве

  function showCard(evt) {
    var target = evt.target;
    if (target.getAttribute('class') !== 'map__pin map__pin--main' && (target.getAttribute('class') === 'map__pin' || (target.tagName === 'IMG' && target.parentNode.getAttribute('class') !== 'map__pin map__pin--main'))) {
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
      findRightAdvert(window.newPins.length);

      window.getCloseButton();
    }
  }

  function findRightAdvert(advertCount) {
    var pinIndex;
    for (var i = 1; i <= advertCount; i++) {
      if (window.mapPins.querySelectorAll('.map__pin')[i].getAttribute('class') === 'map__pin map__pin--active') {
        pinIndex = i - 1;
      }
    }

    var fragment = document.createDocumentFragment();
    fragment.appendChild(window.createOneAdvert(window.newPins[pinIndex]));
    window.cityMap.appendChild(fragment);
  }

  window.showCard = showCard;
})();
