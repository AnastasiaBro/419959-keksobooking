'use strict';

(function () {
  function closeCardAfterFilter() {
    if (window.mapPins.querySelector('.map__pin--active')) {
      window.closeAdvert();
    }
  }

  function hideAllPins() {
    var pinElements = window.cityMap.querySelectorAll('.map__pin');
    for (var i = 1; i < pinElements.length; i++) {
      var mapPin = window.cityMap.querySelectorAll('.map__pin')[1]; // главный пин остается, он [0]
      window.mapPins.removeChild(mapPin);
    }
  }

  // после фильтрации полученный массив передаем в showMapPins
  function filterPins(array, count) {
    var filteredAdverts = window.adverts.reduce(function (accumulator, currentValue, index) {
      if (array[index] === true) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);

    closeCardAfterFilter();
    hideAllPins();

    if (filteredAdverts.length === window.adverts.length) {
      window.newPins = window.getRandomStartElements(count);
    } else if (filteredAdverts.length > count) {
      window.newPins = filteredAdverts.splice(0, count);
    } else {
      window.newPins = filteredAdverts;
    }
    window.showMapPins(window.newPins);
  }

  function findUncheckedFeature(feature) {
    return feature === false;
  }

  function getPriceAsString(price) {
    switch (true) {
      case price < 10000:
        return 'low';
      case price > 50000:
        return 'high';
      default:
        return 'middle';
    }
  }

  function setFilterProcess(selects, checkboxes) {
    var results = [];
    var allUnchekedCheckboxes = checkboxes.every(findUncheckedFeature);

    window.adverts.forEach(function (advert) {
      var allAnyOptions = Object.keys(selects).length === 0;
      var matchedSelect = true;
      var matchedCheckbox = true;
      var advertOptions = [];
      var advertFeatures = advert.offer.features.slice();

      if (allAnyOptions && allUnchekedCheckboxes) {
        results.push(true);
      } else {
        advertOptions['housing-type'] = advert.offer.type;
        advertOptions['housing-price'] = getPriceAsString(advert.offer.price);
        advertOptions['housing-rooms'] = advert.offer.rooms.toString();
        advertOptions['housing-guests'] = advert.offer.guests.toString();

        for (var value in selects) {
          if (advertOptions[value] !== selects[value]) {
            matchedSelect = false;
          }
        }

        checkboxes.forEach(function (feature) {
          if (!advertFeatures.includes(feature)) {
            matchedCheckbox = false;
          }
        });

        results.push(matchedSelect && matchedCheckbox);
      }
    });

    return results;
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
      filterPins(setFilterProcess(selectsValues, checkboxesValues), window.NUMBER_OF_SHOW_PINS);
    });
  }

  window.onFiltersChange = onFiltersChange;
})();
