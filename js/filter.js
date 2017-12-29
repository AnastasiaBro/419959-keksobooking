'use strict';

(function () {
  function closeCardAfterFilter() {
    if (window.elements.mapPins.querySelector('.map__pin--active')) {
      window.closeAdvert();
    }
  }

  function hideAllPins() {
    var pinElements = window.elements.mapPins.querySelectorAll('.map__pin');
    for (var i = 1; i < pinElements.length; i++) {
      window.elements.mapPins.removeChild(pinElements[i]);
    }
  }

  // после фильтрации полученный массив передаем в showMapPins
  function filterPins(array, count) {
    closeCardAfterFilter();
    hideAllPins();

    if (array.length === window.adverts.length) {
      window.newPins = window.getRandomStartElements(count);
    } else if (array.length > count) {
      window.newPins = array.slice(0, count);
    } else {
      window.newPins = array;
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
    var allAnyOptions = Object.keys(selects).length === 0;
    var allUnchekedCheckboxes = checkboxes.every(findUncheckedFeature);

    var results = window.adverts.filter(function (advert) {
      var matchedSelect = true;
      var matchedCheckbox = true;
      var advertOptions = [];
      var advertFeatures = advert.offer.features.slice();

      if (allAnyOptions && allUnchekedCheckboxes) {
        return true;
      } else {
        advertOptions['housing-type'] = advert.offer.type;
        advertOptions['housing-price'] = getPriceAsString(advert.offer.price);
        advertOptions['housing-rooms'] = advert.offer.rooms.toString();
        advertOptions['housing-guests'] = advert.offer.guests.toString();

        for (var value in selects) {
          if (advertOptions[value] !== selects[value]) {
            matchedSelect = false;
            break;
          }
        }

        checkboxes.forEach(function (feature) {
          if (!advertFeatures.includes(feature)) {
            matchedCheckbox = false;
          }
        });

        return (matchedSelect && matchedCheckbox);
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
      var results = setFilterProcess(selectsValues, checkboxesValues);
      filterPins(results, window.constants.NUMBER_OF_SHOW_PINS);
    });
  }

  window.onFiltersChange = onFiltersChange;
})();
