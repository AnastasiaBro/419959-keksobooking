'use strict';

var NUMBER_OF_ADVERTS = 8;
var similarMapCardTemplate = document.querySelector('template').content;
var mapCardTemplate = similarMapCardTemplate.querySelector('article.map__card');
var cityMap = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var adverts = [];
cityMap.classList.remove('map--faded');

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
    var numberRepeat = getRandomIndex(1, MANY_FEATURES.length);
    var CHOOSE_FEATURES = [];
    for (var k = 0; k < numberRepeat; k++) {
      CHOOSE_FEATURES.push(getUniquePart(MANY_FEATURES));
    }
    return CHOOSE_FEATURES;
  }

  for (var j = 0; j < advertNumber; j++) {
    adverts.push({
      'author': {
        'avatar': 'img/avatars/user' + getUniquePart(NUMBER_AVATAR) + '.png',
      },

      'offer': {
        'title': '' + getUniquePart(TITLE_TEXTS),
        'address': 'location.' + COORDINATES_X[j] + ', location.' + COORDINATES_Y[j],
        'price': getRandomIndex(1000, 1000000),
        'type': HOTEL_TYPES[getRandomIndex(0, HOTEL_TYPES.length - 1)],
        'rooms': getRandomIndex(1, 5),
        'guests': getRandomIndex(1, 30),
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

// var advertElement = similarMapCardTemplate.cloneNode(true);

function createAllAdverts(advert) {
  // var advertElement = mapButtonTemplate.cloneNode(true);
  var advertElement = document.createElement('button');
  advertElement.setAttribute('class', 'map__pin');
  advertElement.setAttribute('style', 'left: ' + advert.location.x + 'px; top: ' + advert.location.y + 'px;');
  advertElement.innerHTML = '<img width="40" height="40" draggable="false">';
  advertElement.querySelector('img').setAttribute('src', advert.author.avatar);
  return advertElement;
}

function createOneAdvert(advert) {
  var advertElement = mapCardTemplate.cloneNode(true);

  function getTextType() {
    var text = '';
    if (advert.offer.type.length !== 4) {
      text = (advert.offer.type.length === 7) ? 'Бунгало' : 'Дом';
    } else {
      text = 'Квартира';
    }
    return text;
  }

  advertElement.querySelector('h3').textContent = advert.offer.title;
  advertElement.querySelector('small').textContent = advert.offer.address;
  advertElement.querySelector('.popup__price').textContent = advert.offer.price + String.fromCharCode(8381) + '/ночь';
  advertElement.querySelector('h4').textContent = getTextType();
  advertElement.querySelectorAll('p')[2].textContent = advert.offer.rooms + ' комнат для ' + advert.offer.guests + ' гостей';
  advertElement.querySelectorAll('p')[3].textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;

  if (advert.offer.features.length < 6) {
    for (var m = advert.offer.features.length; m < 6; m++) {
      var help = advertElement.querySelectorAll('.popup__features li')[advert.offer.features.length];
      advertElement.querySelector('.popup__features').removeChild(help);
    }
  }
  for (var n = 0; n < advert.offer.features.length; n++) {
    advertElement.querySelectorAll('.popup__features li')[n].setAttribute('class', 'feature feature--' + advert.offer.features[n]);
  }

  advertElement.querySelectorAll('p')[4].textContent = advert.offer.description;
  advertElement.querySelector('.popup__avatar').setAttribute('src', advert.author.avatar);

  return advertElement;
}

(function insertAdvert() {
  var fragment = document.createDocumentFragment();
  getArrayAdvert(NUMBER_OF_ADVERTS);

  for (var i = 0; i < 1; i++) {
    fragment.appendChild(createOneAdvert(adverts[0]));
  }
  cityMap.appendChild(fragment);

  for (var j = 0; j < NUMBER_OF_ADVERTS; j++) {
    fragment.appendChild(createAllAdverts(adverts[j]));
  }
  mapPins.appendChild(fragment);
})();
