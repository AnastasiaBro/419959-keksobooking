'use strict';

(function () {
  var addressCoordinates = window.mapForm.querySelector('#address');
  var width = parseInt(getComputedStyle(window.mainButton).getPropertyValue('left'), 10) * 2;

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

  function addAddress() {
    var left = parseInt(getComputedStyle(window.mainButton).getPropertyValue('left'), 10);
    var top = parseInt(getComputedStyle(window.mainButton).getPropertyValue('top'), 10);
    addressCoordinates.setAttribute('value', 'x: ' + left + ' y: ' + (top + window.MAIN_PIN_HEIGHT / 2 + window.MAIN_POINTER_HEIGHT));
  }

  function openMap() {
    window.cityMap.classList.remove('map--faded');
    window.mapForm.classList.remove('notice__form--disabled');
    activeForm();
    window.showMapPins(window.NUMBER_OF_SHOW_PINS);
    addAddress();
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
  window.mapPins.addEventListener('mouseup', function (evt) {
    window.showCard(evt);
  });

  window.mapPins.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, window.showCard);
  });

  function onPopupEscPress(evt) {
    window.util.isEscEvent(evt, closeAdvert);
  }

  function onPopupEnterPress(evt) {
    window.util.isEnterEvent(evt, closeAdvert);
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
        topPin = 100 - window.MAIN_PIN_HEIGHT / 2 - window.MAIN_POINTER_HEIGHT;
        window.mapPins.setAttribute('style', 'cursor: none');
      } else if (topPin > 500 - window.MAIN_PIN_HEIGHT / 2 - window.MAIN_POINTER_HEIGHT) {
        topPin = 500 - window.MAIN_PIN_HEIGHT / 2 - window.MAIN_POINTER_HEIGHT;
        window.mapPins.setAttribute('style', 'cursor: none');
      }

      if (leftPin < 0) {
        leftPin = 0;
      } else if (leftPin > width) {
        leftPin = width;
      }

      window.mainButton.style.top = topPin + 'px';
      window.mainButton.style.left = leftPin + 'px';

      addressCoordinates.setAttribute('value', 'x: ' + leftPin + ' y: ' + (topPin + window.MAIN_PIN_HEIGHT / 2 + window.MAIN_POINTER_HEIGHT));
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      window.mapPins.setAttribute('style', 'cursor: auto');

      window.mapPins.removeEventListener('mousemove', onMouseMove);
      window.mapPins.removeEventListener('mouseup', onMouseUp);
    };

    window.mapPins.addEventListener('mousemove', onMouseMove);
    window.mapPins.addEventListener('mouseup', onMouseUp);
  });

  // ------------------------------------------------------------- //
  /* function filterProcess(selects, checkboxes) {
    var filterResult = [];

    function isOff(feature) {
      return feature === false;
    }

    function priceToString(price) {
      switch (true) {
        case price < 10000:
          return 'low';
        case price < 50000:
          return 'middle';
        default:
          return 'high';
      }
    }

    window.adverts.forEach(function (ad) {
      var allOptionsIsAny = Object.keys(selects).length === 0;
      var allCheckboxesUncheked = checkboxes.every(isOff);

      if (allOptionsIsAny && allCheckboxesUncheked) {
        filterResult.push(true);
      } else {
        var isSelectsPass = true;
        var adOptions = [];
        adOptions['housing_type'] = ad.offer.type;
        adOptions['housing_price'] = priceToString(ad.offer.price);
        adOptions['housing_room-number'] = ad.offer.rooms.toString();
        adOptions['housing_guests-number'] = ad.offer.guests.toString();

        for (var property in selects) {
          if (adOptions[property] !== selects[property]) {
            isSelectsPass = false;
          }
        }

        var isCheckboxesPass = true;
        var adFeatures = ad.offer.features.slice();

        checkboxes.forEach(function (feature) {
          if (!adFeatures.includes(feature)) {
            isCheckboxesPass = false;
          }
        });

        filterResult.push(isSelectsPass && isCheckboxesPass);
      }
    });

    return filterResult;
  }

  filterProcess();
  */
  // ------------------------------------------------------------- //

  /* var filterOfPrice = document.querySelector('#housing-price');

  filterOfPrice.addEventListener('change', onFilterPriceClick);

  function hideAllPins() {
    for (var i = 1; i <= window.adverts.length; i++) {
      window.mapPins.querySelectorAll('.map__pin')[i].classList.add('hidden');
    }
  }

  function priceToString(price) {
    switch (true) {
      case price < 10000:
        return 'low';
      case price > 50000:
        return 'high';
      default:
        return 'middle';
    }
  }

  function onFilterPriceClick() {
    hideAllPins();
    priceToString();
    if (window.cityMap.querySelector('.map__pin--active')) {
      closeAdvert();
    }

    var samePricePins = window.adverts.map(function (it) {
      return filterOfPrice.value === priceToString(it.offer.price);
    });
    // console.log(samePricePins);

    for (var i = 0; i <= samePricePins.length - 1; i++) {
      if (samePricePins[i] === true) {
        window.mapPins.querySelectorAll('.map__pin')[i + 1].classList.remove('hidden');
      }
    }
    if (filterOfPrice.value === 'any') {
      showMapPins(window.NUMBER_OF_SHOW_PINS);
    }
  }*/

  // ------------------------------------------------------------- //

  var filterOfPrice = document.querySelector('#housing-price');

  filterOfPrice.addEventListener('change', hideAllPins);

  function hideAllPins() {
    for (var i = 1; i <= window.newPins.length; i++) {
      var mapPin = window.cityMap.querySelectorAll('.map__pin')[1];
      window.mapPins.removeChild(mapPin);
    }
  }

  function priceToString(price) {
    switch (true) {
      case price < 10000:
        return 'low';
      case price > 50000:
        return 'high';
      default:
        return 'middle';
    }
  }

  function onFilterPriceClick() {
    hideAllPins();
    priceToString();
    if (window.cityMap.querySelector('.map__pin--active')) {
      closeAdvert();
    }

    var samePricePins = window.adverts.filter(function (it) {
      return filterOfPrice.value === priceToString(it.offer.price);
    });
    console.log(samePricePins);

    for (var i = 0; i <= samePricePins.length - 1; i++) {
      if (samePricePins[i] === true) {
        window.mapPins.querySelectorAll('.map__pin')[i + 1].classList.remove('hidden');
      }
    }
    if (filterOfPrice.value === 'any') {
      window.showMapPins(window.NUMBER_OF_SHOW_PINS);
    }
  }

  window.getCloseButton = getCloseButton;
  window.getAddress = addressCoordinates;
})();
