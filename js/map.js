'use strict';

function getRandomIndex(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getUniquePart(array) {
  var index = getRandomIndex(0, array.length - 1);
  return array.splice(index, 1);
}

function getArrayAdvert(advertNumber) {
  var NUMBER_AVATAR = ['01', '02', '03', '04', '05', '06', '07', '08'];
  var TITLE_TEXTS = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var HOTEL_TYPES = ['flat', 'house', 'bungalo'];
  var CHECK_TIMES = ['12:00', '13:00', '14:00'];
  var COORDINATES_X = [];
  var COORDINATES_Y = [];

  (function findCoordinates() {
    for (var i = 0; i < advertNumber; i++) {
      COORDINATES_X.push(getRandomIndex(300, 900));
      COORDINATES_Y.push(getRandomIndex(100, 500));
    }
  })();

  function findFeatures() {
    var MANY_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
    var numberRepeat = getRandomIndex(0, MANY_FEATURES.length);
    var CHOOSE_FEATURES = [];
    for (var k = 0; k < numberRepeat; k++) {
      CHOOSE_FEATURES.push(getUniquePart(MANY_FEATURES));
    }
    return CHOOSE_FEATURES;
  }

  var adverts = [];
  for (var j = 0; j < advertNumber; j++) {
    adverts.push({
      'author': {
        'avatar': 'img/avatars/user{{' + getUniquePart(NUMBER_AVATAR) + '}}.png',
      },

      'offer': {
        'title': '' + getUniquePart(TITLE_TEXTS),
        'address': '{{location.' + COORDINATES_X[j] + '}}, {{location.' + COORDINATES_Y[j] + '}}',
        'price': getRandomIndex(1000, 1000000),
        'type': HOTEL_TYPES[getRandomIndex(0, HOTEL_TYPES.length - 1)],
        'rooms': getRandomIndex(1, 5),
        'guests': getRandomIndex(1, 100),
        'checkin': '' + CHECK_TIMES[getRandomIndex(0, CHECK_TIMES.length - 1)],
        'checkout': '' + CHECK_TIMES[getRandomIndex(0, CHECK_TIMES.length - 1)],
        'features': findFeatures(),
        'description': '',
        'photos': []
      },

      'location': {
        'x': COORDINATES_X[j],
        'y': COORDINATES_Y[j]
      }
    });
  }
  return adverts;
}
