'use strict';

(function () {
  function closeCardAfterFilter() {
    if (window.mapPins.querySelector('.map__pin--active')) {
      window.closeAdvert();
    }
  }

  function hideAllPins() {
    var pinsCount = window.cityMap.querySelectorAll('.map__pin');
    for (var i = 1; i < pinsCount.length; i++) {
      var mapPin = window.cityMap.querySelectorAll('.map__pin')[1]; // главный пин остается, он [0]
      window.mapPins.removeChild(mapPin);
    }
  }

  function showFilteredPins(array) {
    var filteredAdverts = window.adverts.reduce(function (accumulator, currentValue, index) {
      if (array[index] === true) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);

    closeCardAfterFilter();
    hideAllPins();

    if (filteredAdverts.length === window.adverts.length) {
      window.newPins = window.getRandomStartElements(window.NUMBER_OF_SHOW_PINS);
    } else if (filteredAdverts.length > window.NUMBER_OF_SHOW_PINS) {
      window.newPins = filteredAdverts.splice(0, window.NUMBER_OF_SHOW_PINS);
    } else {
      window.newPins = filteredAdverts;
    }
    window.showMapPins(window.newPins);
  }

  function findUncheckedFeature(feature) {
    return feature === false;
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

  function filterProcess(selects, checkboxes) {
    var result = [];

    window.adverts.forEach(function (advert) {
      var allAnyOptions = Object.keys(selects).length === 0;
      var allUnchekedCheckboxes = checkboxes.every(findUncheckedFeature);
      var isSelectsPass = true;
      var advertOptions = [];
      var isCheckboxesPass = true;
      var advertFeatures = advert.offer.features.slice();

      if (allAnyOptions && allUnchekedCheckboxes) {
        result.push(true);
      } else {
        advertOptions['housing-type'] = advert.offer.type;
        advertOptions['housing-price'] = priceToString(advert.offer.price);
        advertOptions['housing-rooms'] = advert.offer.rooms.toString();
        advertOptions['housing-guests'] = advert.offer.guests.toString();

        for (var value in selects) {
          if (advertOptions[value] !== selects[value]) {
            isSelectsPass = false;
          }
        }

        checkboxes.forEach(function (feature) {
          if (!advertFeatures.includes(feature)) {
            isCheckboxesPass = false;
          }
        });

        result.push(isSelectsPass && isCheckboxesPass);
      }
    });

    return result;
  }

  function onFiltersChange(evt) {
    var selects = evt.currentTarget.querySelectorAll('select');
    var selectsValues = [];
    var checkboxes = evt.currentTarget.querySelectorAll('input');
    var checkboxesValues = [];

    [].forEach.call(selects, function (select) {
      if (select.value !== 'any') {
        selectsValues[select.name] = select.value;
      }
    });

    [].forEach.call(checkboxes, function (checkbox) {
      if (checkbox.checked) {
        checkboxesValues.push(checkbox.value);
      }
    });

    window.debounce(function () {
      showFilteredPins(filterProcess(selectsValues, checkboxesValues));
    });
  }

  window.onFiltersChange = onFiltersChange;
})();
