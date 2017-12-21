'use strict';

(function () {
  function renderFilterApply(arrBools) {
    var unCgangeArr = window.adverts;
    var similarListElement = document.querySelector('.map__pins');
    var activePins = similarListElement.querySelectorAll('.map__pin');
    var fragment = document.createDocumentFragment();
    var nameLengths = unCgangeArr.reduce(function (accumulator, currentValue, index) {
      if (arrBools[index] === true) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);

    for (var i = 0; i < nameLengths.length; i++) {
      if (i > 4) {
        break;
      }
      fragment.appendChild(window.createAllAdverts(nameLengths[i], nameLengths));
      console.log(nameLengths);
    }

    if (similarListElement.querySelector('.map__pin--active')) {
      window.closeAdvert();
    }

    for (var j = 0; j < activePins.length; j++) {
      if (j !== 0) {
        similarListElement.removeChild(activePins[j]);
      }
    }
    similarListElement.appendChild(fragment);
    if (nameLengths.length > 5) {
      window.newPins = nameLengths.splice(0, 5);
    } else {
      window.newPins = nameLengths;
    }
  }

  // window.renderFilterApply = renderFilterApply;

  function filterProcess(selects, checkboxes) {
    var filterResult = [];
    var adList = window.adverts;
    // console.log(adList);
    function isOff(feature) {
      return feature === false;
    }
    // console.log(selects, checkboxes);
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

    adList.forEach(function (ad) {
      var allOptionsIsAny = Object.keys(selects).length === 0;
      var allCheckboxesUncheked = checkboxes.every(isOff);
      // console.log(allCheckboxesUncheked, allOptionsIsAny);
      if (allOptionsIsAny && allCheckboxesUncheked) {
        filterResult.push(true);
      } else {
        var isSelectsPass = true;
        var adOptions = [];
        adOptions['housing-type'] = ad.offer.type;
        adOptions['housing-price'] = priceToString(ad.offer.price);
        adOptions['housing-rooms'] = ad.offer.rooms.toString();
        adOptions['housing-guests'] = ad.offer.guests.toString();

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

  /* ---------------------------------------------------------------------------
   * Handler of the filters selects and checkboxes changing
   * @param {Object} - event object
   */
  function onFiltersChange(event) {
    var selects = event.currentTarget.querySelectorAll('select');
    var selectsValues = [];
    [].forEach.call(selects, function (select) {
      if (select.value !== 'any') {
        selectsValues[select.name] = select.value;
      }
    });

    var checkboxes = event.currentTarget.querySelectorAll('input');
    var checkboxesValues = [];
    [].forEach.call(checkboxes, function (checkbox) {
      if (checkbox.checked) {
        checkboxesValues.push(checkbox.value);
      }
    });

    var filters = filterProcess(selectsValues, checkboxesValues);

    window.debounce(function () {
      // window.pin.applyFilter(filters);
      renderFilterApply(filters);
    });
  }

  window.onFiltersChange = onFiltersChange;

})();
