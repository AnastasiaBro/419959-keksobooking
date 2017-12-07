'use strict';

(function () {
  function getPictureNumbers(value) {
    var pictureNumbers = [];
    for (var i = 1; i <= value; i++) {
      pictureNumbers.push('0' + i);
    }
    return pictureNumbers;
  }

  function findCoordinates(minValue, maxValue, advertCount) {
    var coordinates = [];
    for (var i = 0; i < advertCount; i++) {
      coordinates.push(window.util.getRandomIndex(minValue, maxValue));
    }
    return coordinates;
  }

  function findFeatures(features) {
    var copyOfFeatures = features.slice();
    var numberRepeat = window.util.getRandomIndex(1, copyOfFeatures.length);
    var chosenFeatures = [];
    for (var i = 0; i < numberRepeat; i++) {
      chosenFeatures.push(window.util.getUniquePart(copyOfFeatures));
    }
    return chosenFeatures;
  }

  // создание данных

  function getArrayAdvert(advertNumber) {
    var adverts = [];
    var numbers = getPictureNumbers(advertNumber);
    var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
    var types = ['flat', 'house', 'bungalo'];
    var times = ['12:00', '13:00', '14:00'];
    var coordinatesX = findCoordinates(300, 900, advertNumber);
    var coordinatesY = findCoordinates(100, 500, advertNumber);
    var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

    for (var i = 0; i < advertNumber; i++) {
      adverts.push({
        'author': {
          'avatar': 'img/avatars/user' + window.util.getUniquePart(numbers) + '.png',
        },

        'offer': {
          'title': '' + window.util.getUniquePart(titles),
          'address': '' + coordinatesX[i] + ', ' + coordinatesY[i],
          'price': window.util.getRandomIndex(1000, 1000000),
          'type': types[window.util.getRandomIndex(0, types.length - 1)],
          'rooms': window.util.getRandomIndex(1, 5),
          'guests': window.util.getRandomIndex(1, 30),
          'checkin': '' + times[window.util.getRandomIndex(0, times.length - 1)],
          'checkout': '' + times[window.util.getRandomIndex(0, times.length - 1)],
          'features': findFeatures(features),
          'description': '',
          'photos': []
        },

        'location': {
          'x': coordinatesX[i],
          'y': coordinatesY[i]
        }
      });
    }
    return adverts;
  }
  window.adverts = getArrayAdvert(window.NUMBER_OF_ADVERTS);
})();
