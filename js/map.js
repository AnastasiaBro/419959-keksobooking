'use strict';

var NUMBER_OF_ADVERTS = 8;
var COUNT_FEATURES = 6;
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
  var numbers = getPictureNumbers(advertNumber);
  var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var types = ['flat', 'house', 'bungalo'];
  var times = ['12:00', '13:00', '14:00'];
  var coordinatesX = [];
  var coordinatesY = [];

  function getPictureNumbers(value) {
    var numbers = [];
    for (var i = 1; i <= value; i++) {
      numbers.push('0' + i);
    }
    return numbers;
  }

  (function findCoordinates() {
    for (var i = 0; i < advertNumber; i++) {
      coordinatesX.push(getRandomIndex(300, 900) + 20);
      coordinatesY.push(getRandomIndex(100, 500) + 40);
    }
  })();

  function findFeatures() {
    var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
    var numberRepeat = getRandomIndex(1, features.length);
    var choises = [];
    for (var i = 0; i < numberRepeat; i++) {
      choises.push(getUniquePart(features));
    }
    return choises;
  }

  for (var i = 0; i < advertNumber; i++) {
    adverts.push({
      'author': {
        'avatar': 'img/avatars/user' + getUniquePart(numbers) + '.png',
      },

      'offer': {
        'title': '' + getUniquePart(titles),
        'address': '' + coordinatesX[i] + ', ' + coordinatesY[i],
        'price': getRandomIndex(1000, 1000000),
        'type': types[getRandomIndex(0, types.length - 1)],
        'rooms': getRandomIndex(1, 5),
        'guests': getRandomIndex(1, 30),
        'checkin': '' + times[getRandomIndex(0, times.length - 1)],
        'checkout': '' + times[getRandomIndex(0, times.length - 1)],
        'features': findFeatures(),
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

function createAllAdverts(advert) {
  var advertElement = document.createElement('button');
  advertElement.setAttribute('class', 'map__pin');
  advertElement.setAttribute('style', 'left: ' + advert.location.x + 'px; top: ' + advert.location.y + 'px;');
  advertElement.innerHTML = '<img width="40" height="40" draggable="false">';
  advertElement.querySelector('img').setAttribute('src', advert.author.avatar);
  return advertElement;
}

function createOneAdvert(advert) {
  var advertElement = mapCardTemplate.cloneNode(true);

  function translatePlaceType(englishType) {
    var translate = {
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    };
    return translate[englishType];
  }

  advertElement.querySelector('h3').textContent = advert.offer.title;
  advertElement.querySelector('small').textContent = advert.offer.address;
  advertElement.querySelector('.popup__price').textContent = advert.offer.price + ' ' + String.fromCharCode(8381) + ' / ночь';
  advertElement.querySelector('h4').textContent = translatePlaceType(advert.offer.type);

  function addCorrectRoomEnding() {
    var ending = '';
    if (advert.offer.rooms !== 5) {
      ending = (advert.offer.rooms === 1) ? 'а' : 'ы';
    } else {
      ending = '';
    }
    return ending;
  }

  function addCorrectGuestEnding() {
    var ending = (advert.offer.guests % 10 === 1 && advert.offer.guests !== 11) === true ? 'я' : 'ей';
    return ending;
  }

  advertElement.querySelectorAll('p')[2].textContent = advert.offer.rooms + ' комнат' + addCorrectRoomEnding() + ' для ' + advert.offer.guests + ' гост' + addCorrectGuestEnding();
  advertElement.querySelectorAll('p')[3].textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;

  (function addFeatures() {
    if (advert.offer.features.length < COUNT_FEATURES) {
      for (var i = advert.offer.features.length; i < COUNT_FEATURES; i++) {
        var extra = advertElement.querySelectorAll('.popup__features li')[advert.offer.features.length];
        advertElement.querySelector('.popup__features').removeChild(extra);
      }
    }
    for (var i = 0; i < advert.offer.features.length; i++) {
      advertElement.querySelectorAll('.popup__features li')[i].setAttribute('class', 'feature feature--' + advert.offer.features[i]);
    }
  })();

  advertElement.querySelectorAll('p')[4].textContent = advert.offer.description;
  advertElement.querySelector('.popup__avatar').setAttribute('src', advert.author.avatar);

  return advertElement;
}

function insertAdvert(advertsCount) {
  var fragment = document.createDocumentFragment();
  getArrayAdvert(advertsCount);

  fragment.appendChild(createOneAdvert(adverts[0]));
  cityMap.appendChild(fragment);

  for (var i = 0; i < advertsCount; i++) {
    fragment.appendChild(createAllAdverts(adverts[i]));
  }
  mapPins.appendChild(fragment);
}

insertAdvert(NUMBER_OF_ADVERTS);
