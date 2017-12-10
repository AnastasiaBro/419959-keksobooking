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

  function addAddress() {
    var left = parseInt(getComputedStyle(window.mainButton).getPropertyValue('left'), 10);
    var top = parseInt(getComputedStyle(window.mainButton).getPropertyValue('top'), 10);
    window.address.setAttribute('value', 'x: ' + left + ' y: ' + (top + window.MAIN_PIN_HEIGHT / 2 + window.MAIN_POINTER_HEIGHT));
  }

  function openMap() {
    window.cityMap.classList.remove('map--faded');
    window.mapForm.classList.remove('notice__form--disabled');
    activeForm();
    showMapPins();
    addAddress();
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

  // задание 5.2
  var width = parseInt(getComputedStyle(window.mainButton).getPropertyValue('left'), 10) * 2;

  window.mainButton.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var topPin = window.mainButton.offsetTop - shift.y;
      var leftPin = window.mainButton.offsetLeft - shift.x;

      // topPin - координата верхней границы метки, поэтому вычитаю из 100 высоту метки
      // с учетом того, что у нее translate -50% (поэтому делю на 2) и еще есть высота псевдоэлемента

      if (topPin < (100 - window.MAIN_PIN_HEIGHT / 2 - window.MAIN_POINTER_HEIGHT)) {
        topPin = (100 - window.MAIN_PIN_HEIGHT / 2 - window.MAIN_POINTER_HEIGHT);
      } else if (topPin > 500 - window.MAIN_PIN_HEIGHT / 2 - window.MAIN_POINTER_HEIGHT) {
        topPin = 500 - window.MAIN_PIN_HEIGHT / 2 - window.MAIN_POINTER_HEIGHT;
      }

      if (leftPin < 0) {
        leftPin = 0;
      } else if (leftPin > width) {
        leftPin = width;
      }

      window.mainButton.style.top = topPin + 'px';
      window.mainButton.style.left = leftPin + 'px';

      window.address.setAttribute('value', 'x: ' + leftPin + ' y: ' + (topPin + window.MAIN_PIN_HEIGHT / 2 + window.MAIN_POINTER_HEIGHT));
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      window.mapPins.removeEventListener('mousemove', onMouseMove);
      window.mapPins.removeEventListener('mouseup', onMouseUp);
    };

    window.mapPins.addEventListener('mousemove', onMouseMove);
    window.mapPins.addEventListener('mouseup', onMouseUp);
  });

// ВТОРОЙ ВАРИАНТ, работает, но с магическими числами и не понятно, как ограничить

  /* window.mainButton.onmousedown = function (e) {

    var coords = getCoords(window.mainButton);
    var shiftX = e.pageX - coords.left;
    var shiftY = e.pageY - coords.top;

    moveAt(e);

    function moveAt(evt) {
      window.mainButton.style.left = evt.pageX - shiftX - 120 + 'px';  // магические числа
      window.mainButton.style.top = evt.pageY - shiftY + 40 + 'px';
    }

    window.mapPins.onmousemove = function (evt) {
      moveAt(evt);
    };

    window.mainButton.onmouseup = function () {
      window.mapPins.onmousemove = null;
      window.mainButton.onmouseup = null;
    };

  };

  window.mainButton.ondragstart = function () {
    return false;
  };

  function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  }*/

})();
