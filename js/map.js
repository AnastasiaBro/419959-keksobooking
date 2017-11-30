'use strict';

var NUMBER_OF_ADVERTS = 8;
var COUNT_FEATURES = 6;
var MAP_HEIGHT = 44;
var POINTER_HEIGHT = 18;
var similarMapCardTemplate = document.querySelector('template').content;
var mapCardTemplate = similarMapCardTemplate.querySelector('article.map__card');
var cityMap = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var adverts = [];
// cityMap.classList.remove('map--faded');

function getRandomIndex(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getUniquePart(array) {
  var index = getRandomIndex(0, array.length - 1);
  return array.splice(index, 1).toString();
}

function getArrayAdvert(advertNumber) {
  var numbers = getPictureNumbers(advertNumber);
  var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var types = ['flat', 'house', 'bungalo'];
  var times = ['12:00', '13:00', '14:00'];
  var coordinatesX = [];
  var coordinatesY = [];

  function getPictureNumbers(value) {
    var pictureNumbers = [];
    for (var i = 1; i <= value; i++) {
      pictureNumbers.push('0' + i);
    }
    return pictureNumbers;
  }

  (function findCoordinates() {
    for (var i = 0; i < advertNumber; i++) {
      coordinatesX.push(getRandomIndex(300, 900));
      coordinatesY.push(getRandomIndex(100, 500));
    }
  })();

  function findFeatures() {
    var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
    var numberRepeat = getRandomIndex(1, features.length);
    var chosenFeatures = [];
    for (var i = 0; i < numberRepeat; i++) {
      chosenFeatures.push(getUniquePart(features));
    }
    return chosenFeatures;
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
  advertElement.setAttribute('style', 'left: ' + advert.location.x + 'px; top: ' + (advert.location.y - MAP_HEIGHT / 2 - POINTER_HEIGHT) + 'px;');
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
    var i = 0;
    if (advert.offer.features.length < COUNT_FEATURES) {
      for (i = advert.offer.features.length; i < COUNT_FEATURES; i++) {
        var extra = advertElement.querySelectorAll('.popup__features li')[advert.offer.features.length];
        advertElement.querySelector('.popup__features').removeChild(extra);
      }
    }
    for (i = 0; i < advert.offer.features.length; i++) {
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
  var i = 0;

  for (i = 0; i < advertsCount; i++) {
    fragment.appendChild(createOneAdvert(adverts[i]));
  }
  cityMap.appendChild(fragment);

  for (i = 0; i < advertsCount; i++) {
    fragment.appendChild(createAllAdverts(adverts[i]));
  }
  mapPins.appendChild(fragment);
}

insertAdvert(NUMBER_OF_ADVERTS);

// задание 4 урока

// сначала я скрываю все пины и описания (к прошлому заданию добавила генерацию сразу всех объявлений, а не только первого)
// так как не получалось по-другому
(function hiddenAdverts() {
  for (var i = 0; i < NUMBER_OF_ADVERTS; i++) {
    cityMap.querySelectorAll('.map__card')[i].classList.add('hidden');
    mapPins.querySelectorAll('.map__pin')[i + 1].classList.add('hidden');
  }
})();

var mainButton = cityMap.querySelector('.map__pin--main'); // это пироженка
var mapForm = document.querySelector('.notice__form'); // это форма
var FORMS_COUNT = 12; // это количество fieldset

// форма закрыта изначально - все fieldset disabled
(function disableForm() {
  for (var i = 0; i < FORMS_COUNT; i++) {
    mapForm.querySelectorAll('fieldset')[i].setAttribute('disabled', 'disabled');
  }
})();

// активация формы, произойдет при openMap
function activeForm() {
  for (var i = 0; i < FORMS_COUNT; i++) {
    mapForm.querySelectorAll('fieldset')[i].removeAttribute('disabled');
  }
}

// активируем карту и форму
function openMap() {
  cityMap.classList.remove('map--faded');
  mapForm.classList.remove('notice__form--disabled');
  activeForm();
  mainButton.setAttribute('disabled', 'disabled');

  for (var i = 0; i < NUMBER_OF_ADVERTS; i++) {
    mapPins.querySelectorAll('.map__pin')[i + 1].classList.remove('hidden');
  }
}

// событие - открытие формы при нажатии на пироженку
mainButton.addEventListener('mouseup', function () {
  openMap();
});

// показывает объявление при нажатии на любой пин, почему-то работает только через enter, а при клике мышкой - нет
// сначала проверяю, нет ли активного пина, если что - снимаю active
// дальше проверяю - если событие не на pinsoverlay и не на main, то все ок - добавляем active
// дальше нахожу для одного из 8 пинов (начинаю с 1, т.к. 0 - это button main) его индекс, чтобы
// затем найти его карточку (map__card), i-1 т.к. карточек меньше на 1, чем пинов
function openAdvert(event) {
  if (mapPins.querySelector('.map__pin--active')) {
    mapPins.querySelector('.map__pin--active').classList.remove('map__pin--active');
  }
  var target = event.target;

  if (target.getAttribute('class') !== 'map__pinsoverlay' && target.getAttribute('class') !== 'map__pin map__pin--main') {
    target.classList.add('map__pin--active');
    for (var i = 1; i < 9; i++) {
      if (mapPins.querySelectorAll('.map__pin')[i].getAttribute('class') === 'map__pin map__pin--active') {
        var pinIndex = i - 1;
        cityMap.querySelectorAll('.map__card')[pinIndex].classList.remove('hidden');
      }
    }
  }
  return pinIndex;
}

// а это для родителя всех пинов событие
mapPins.addEventListener('click', openAdvert);

// хотела найти кнопку закрытия и не смогла
var closePopup = document.querySelector('.popup__close');

closePopup.addEventListener('mouseup', function () {
  closeAdvert();
});

var closeAdvert = function () {
  for (var i = 0; i < 8; i++) {
    if (cityMap.querySelectorAll('.map__card')[i].getAttribute('class') !== 'map__card popup hidden') {
      cityMap.querySelectorAll('.map__card')[i].classList.add('hidden');
    }
  }
};
