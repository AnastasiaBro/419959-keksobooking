'use strict';

(function () {
  var addressCoordinates = window.elements.mapForm.querySelector('#address');
  var width = parseInt(getComputedStyle(window.elements.mainButton).getPropertyValue('left'), 10) * 2;
  window.elements.mainButton.setAttribute('tabindex', '0');

  function disableForm(fieldsetCount) {
    for (var i = 0; i < fieldsetCount; i++) {
      window.elements.mapForm.querySelectorAll('fieldset')[i].setAttribute('disabled', 'disabled');
    }
  }
  disableForm(window.constants.FIELDSET_COUNT);

  // активация формы, произойдет при openMap
  function activeForm() {
    for (var i = 0; i < window.constants.FIELDSET_COUNT; i++) {
      window.elements.mapForm.querySelectorAll('fieldset')[i].removeAttribute('disabled');
    }
  }

  function addAddress(input) {
    var left = parseInt(getComputedStyle(window.elements.mainButton).getPropertyValue('left'), 10);
    var top = parseInt(getComputedStyle(window.elements.mainButton).getPropertyValue('top'), 10);
    input.setAttribute('value', 'x: ' + left + ' y: ' + (top + window.constants.MAIN_PIN_HEIGHT / 2 + window.constants.MAIN_POINTER_HEIGHT));
  }

  function openMap() {
    window.elements.cityMap.classList.remove('map--faded');
    window.elements.mapForm.classList.remove('notice__form--disabled');
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
  window.elements.mainButton.addEventListener('mouseup', function () {
    if (window.elements.cityMap.getAttribute('class') === 'map map--faded') {
      openMap();
    }
  });

  window.elements.mainButton.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, openMap);
  });

  // это событие - нажатие на любой пин
  window.elements.mapPins.addEventListener('click', function (evt) {
    window.showCard(evt, window.newPins);
  });

  function getCloseButton() {
    var closeButton = window.elements.cityMap.querySelector('.popup__close');
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
    var mapCard = window.elements.cityMap.querySelector('.map__card');
    window.elements.cityMap.removeChild(mapCard);
    window.elements.cityMap.querySelector('.map__pin--active').classList.remove('map__pin--active');
    document.removeEventListener('keydown', onPopupEscPress);
  }

  window.elements.mainButton.addEventListener('mousedown', function (evt) {
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

      var topPin = window.elements.mainButton.offsetTop - shift.y;
      var leftPin = window.elements.mainButton.offsetLeft - shift.x;

      // topPin - координата верхней границы метки, поэтому вычитаю из 100 высоту метки
      // с учетом того, что у нее translate -50% (поэтому делю на 2) и еще есть высота псевдоэлемента

      if (topPin < (window.constants.LIMIT_TOP - window.constants.MAIN_PIN_HEIGHT / 2 - window.constants.MAIN_POINTER_HEIGHT)) {
        topPin = window.constants.LIMIT_TOP - window.constants.MAIN_PIN_HEIGHT / 2 - window.constants.MAIN_POINTER_HEIGHT;
        window.elements.mapPins.setAttribute('style', 'cursor: none');
      } else if (topPin > window.constants.LIMIT_BOTTOM - window.constants.MAIN_PIN_HEIGHT / 2 - window.constants.MAIN_POINTER_HEIGHT) {
        topPin = window.constants.LIMIT_BOTTOM - window.constants.MAIN_PIN_HEIGHT / 2 - window.constants.MAIN_POINTER_HEIGHT;
        window.elements.mapPins.setAttribute('style', 'cursor: none');
      }

      if (leftPin < 0) {
        leftPin = 0;
      } else if (leftPin > width) {
        leftPin = width;
      }

      window.elements.mainButton.style.top = topPin + 'px';
      window.elements.mainButton.style.left = leftPin + 'px';

      addressCoordinates.setAttribute('value', 'x: ' + leftPin + ' y: ' + (topPin + window.constants.MAIN_PIN_HEIGHT / 2 + window.constants.MAIN_POINTER_HEIGHT));
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      window.elements.mapPins.setAttribute('style', 'cursor: auto');

      window.elements.mapPins.removeEventListener('mousemove', onMouseMove);
      window.elements.mapPins.removeEventListener('mouseup', onMouseUp);
    }

    window.elements.mapPins.addEventListener('mousemove', onMouseMove);
    window.elements.mapPins.addEventListener('mouseup', onMouseUp);
  });

  window.getCloseButton = getCloseButton;
  window.addAddress = addAddress;
  window.closeAdvert = closeAdvert;
})();
