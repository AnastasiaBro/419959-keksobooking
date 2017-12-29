'use strict';

(function () {
  var addressCoordinates = window.mapForm.querySelector('#address');
  var width = parseInt(getComputedStyle(window.mainButton).getPropertyValue('left'), 10) * 2;
  window.mainButton.setAttribute('tabindex', '0');

  function disableForm(fieldsetCount) {
    for (var i = 0; i < fieldsetCount; i++) {
      window.mapForm.querySelectorAll('fieldset')[i].setAttribute('disabled', 'disabled');
    }
  }
  disableForm(window.constants.FIELDSET_COUNT);

  // активация формы, произойдет при openMap
  function activeForm() {
    for (var i = 0; i < window.constants.FIELDSET_COUNT; i++) {
      window.mapForm.querySelectorAll('fieldset')[i].removeAttribute('disabled');
    }
  }

  function addAddress(input) {
    var left = parseInt(getComputedStyle(window.mainButton).getPropertyValue('left'), 10);
    var top = parseInt(getComputedStyle(window.mainButton).getPropertyValue('top'), 10);
    input.setAttribute('value', 'x: ' + left + ' y: ' + (top + window.constants.MAIN_PIN_HEIGHT / 2 + window.constants.MAIN_POINTER_HEIGHT));
  }

  function openMap() {
    window.cityMap.classList.remove('map--faded');
    window.mapForm.classList.remove('notice__form--disabled');
    activeForm();
    if (window.adverts) {
      window.newPins = window.getRandomStartElements(window.constants.NUMBER_OF_SHOW_PINS);
      window.showMapPins(window.newPins);
    }
    addAddress(addressCoordinates);

    var filterBox = document.querySelector('.map__filters');
    filterBox.addEventListener('change', window.onFiltersChange);
  }

  // событие - открытие формы при нажатии на пироженку
  window.mainButton.addEventListener('mouseup', function () {
    if (window.cityMap.getAttribute('class') === 'map map--faded') {
      openMap();
    }
  });

  window.mainButton.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, openMap);
  });

  // это событие - нажатие на любой пин
  window.mapPins.addEventListener('click', function (evt) {
    window.showCard(evt, window.newPins);
  });

  function getCloseButton() {
    var closeButton = window.cityMap.querySelector('.popup__close');
    closeButton.setAttribute('tabindex', '0');
    document.addEventListener('keydown', onPopupEscPress);
    closeButton.addEventListener('mouseup', function () {
      closeAdvert();
    });

    closeButton.addEventListener('keydown', onPopupEnterPress);
  }

  function onPopupEscPress(evt) {
    window.util.isEscEvent(evt, closeAdvert);
  }

  function onPopupEnterPress(evt) {
    window.util.isEnterEvent(evt, closeAdvert);
  }

  function closeAdvert() {
    var mapCard = window.cityMap.querySelector('.map__card');
    window.cityMap.removeChild(mapCard);
    window.cityMap.querySelector('.map__pin--active').classList.remove('map__pin--active');
    document.removeEventListener('keydown', onPopupEscPress);
  }

  window.mainButton.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMouseMove(moveEvt) {
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

      if (topPin < (window.constants.LIMIT_TOP - window.constants.MAIN_PIN_HEIGHT / 2 - window.constants.MAIN_POINTER_HEIGHT)) {
        topPin = window.constants.LIMIT_TOP - window.constants.MAIN_PIN_HEIGHT / 2 - window.constants.MAIN_POINTER_HEIGHT;
        window.mapPins.setAttribute('style', 'cursor: none');
      } else if (topPin > window.constants.LIMIT_BOTTOM - window.constants.MAIN_PIN_HEIGHT / 2 - window.constants.MAIN_POINTER_HEIGHT) {
        topPin = window.constants.LIMIT_BOTTOM - window.constants.MAIN_PIN_HEIGHT / 2 - window.constants.MAIN_POINTER_HEIGHT;
        window.mapPins.setAttribute('style', 'cursor: none');
      }

      if (leftPin < 0) {
        leftPin = 0;
      } else if (leftPin > width) {
        leftPin = width;
      }

      window.mainButton.style.top = topPin + 'px';
      window.mainButton.style.left = leftPin + 'px';

      addressCoordinates.setAttribute('value', 'x: ' + leftPin + ' y: ' + (topPin + window.constants.MAIN_PIN_HEIGHT / 2 + window.constants.MAIN_POINTER_HEIGHT));
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      window.mapPins.setAttribute('style', 'cursor: auto');

      window.mapPins.removeEventListener('mousemove', onMouseMove);
      window.mapPins.removeEventListener('mouseup', onMouseUp);
    }

    window.mapPins.addEventListener('mousemove', onMouseMove);
    window.mapPins.addEventListener('mouseup', onMouseUp);
  });

  window.getCloseButton = getCloseButton;
  window.addAddress = addAddress;
  window.closeAdvert = closeAdvert;
})();
