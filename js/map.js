'use strict';

(function () {
  function hidePins(pinCount) {
    for (var i = 0; i < pinCount; i++) {
      window.mapPins.querySelectorAll('.map__pin')[i + 1].classList.add('hidden');
    }
  }
  hidePins(window.NUMBER_OF_ADVERTS);

  function disableForm(fieldsetCount) {
    for (var i = 0; i < fieldsetCount; i++) {
      window.mapForm.querySelectorAll('fieldset')[i].setAttribute('disabled', 'disabled');
    }
  }
  disableForm(window.FIELDSET_COUNT);

  // активация формы, произойдет при openMap
  function activeForm() {
    for (var i = 0; i < window.FIELDSET_COUNT; i++) {
      window.mapForm.querySelectorAll('fieldset')[i].removeAttribute('disabled');
    }
  }

  function showMapPins() {
    for (var i = 0; i < window.NUMBER_OF_ADVERTS; i++) {
      window.mapPins.querySelectorAll('.map__pin')[i + 1].classList.remove('hidden');
    }
  }

  function openMap() {
    window.cityMap.classList.remove('map--faded');
    window.mapForm.classList.remove('notice__form--disabled');
    activeForm();
    showMapPins();
  }

  // событие - открытие формы при нажатии на пироженку
  window.mainButton.addEventListener('mouseup', function () {
    openMap();
  });

  window.mainButton.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, openMap);
  });

  // это событие - нажатие на любой пин
  window.mapPins.addEventListener('mouseup', function (evt) {
    openAdvert(evt);
  });

  window.mapPins.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, openAdvert);
  });

  function onPopupEscPress(evt) {
    window.util.isEscEvent(evt, closeAdvert);
  }

  function onPopupEnterPress(evt) {
    window.util.isEnterEvent(evt, closeAdvert);
  }

  // сначала проверка - если не main пин И (это пин ИЛИ (это img И родитель не main))
  // потом условие, чтоб событие сработало на button
  // потом если при открытой карточке нажать на другую - старая закроется
  // если был активный пин - убираем ему класс active
  // а текущему добавляем
  // потом вставляю правильное объявление
  // потом рассматриваю закрытие объявления здесь же, т.к. каждый раз генерируется новое объявление в дом-дереве

  function openAdvert(evt) {
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
      findRightAdvert(window.NUMBER_OF_ADVERTS);
      getCloseButton();
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
    fragment.appendChild(window.createOneAdvert(window.adverts[pinIndex]));
    window.cityMap.appendChild(fragment);
  }

  function getCloseButton() {
    var closeButton = window.cityMap.querySelector('.popup__close');
    document.addEventListener('keydown', onPopupEscPress);
    closeButton.addEventListener('mouseup', function () {
      closeAdvert();
    });

    closeButton.addEventListener('keydown', onPopupEnterPress);
  }

  function closeAdvert() {
    var mapCard = window.cityMap.querySelector('.map__card');
    window.cityMap.removeChild(mapCard);
    window.cityMap.querySelector('.map__pin--active').classList.remove('map__pin--active');
    document.removeEventListener('keydown', onPopupEscPress);
  }
})();
