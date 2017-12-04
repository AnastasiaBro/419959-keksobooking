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

  for (var i = 0; i < advertsCount; i++) {
    fragment.appendChild(createAllAdverts(adverts[i]));
  }
  mapPins.appendChild(fragment);
}

insertAdvert(NUMBER_OF_ADVERTS);

// задание 4 урока

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var FORMS_COUNT = 12; // это количество fieldset
var mainButton = cityMap.querySelector('.map__pin--main'); // это пироженка
var mapForm = document.querySelector('.notice__form'); // это форма

(function hidePins() {
  for (var i = 0; i < NUMBER_OF_ADVERTS; i++) {
    mapPins.querySelectorAll('.map__pin')[i + 1].classList.add('hidden');
  }
})();

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

function showMapPins() {
  for (var i = 0; i < NUMBER_OF_ADVERTS; i++) {
    mapPins.querySelectorAll('.map__pin')[i + 1].classList.remove('hidden');
  }
}

// активируем карту и форму
function openMap() {
  cityMap.classList.remove('map--faded');
  mapForm.classList.remove('notice__form--disabled');
  mainButton.setAttribute('disabled', 'disabled');
  activeForm();
  showMapPins();
}

// событие - открытие формы при нажатии на пироженку
mainButton.addEventListener('mouseup', function () {
  openMap();
});

mainButton.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openMap();
  }
});

// это событие - нажатие на любой пин
mapPins.addEventListener('mouseup', function (evt) {
  openAdvert(evt);
});

mapPins.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openAdvert(evt);
  }
});

// ниже второе условие - ограничение - существует ли вообще popup
function onPopupEscPress(evt) {
  if (evt.keyCode === ESC_KEYCODE && cityMap.querySelector('.map__card')) {
    closeAdvert();
  }
}

function onPopupEnterPress(evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeAdvert();
  }
}

// сначала проверка - если не main пин И (это пин ИЛИ (это img И родитель не main))
// потом условие, чтоб событие сработало на button
// потом если при открытой карточке нажать на другую - старая закроется
// если был активный пин - убираем ему класс active
// а текущему добавляем
// потом вставляю правильное объявление
// потом рассматриваю закрытие объявления здесь же, т.к. каждый раз генерируется новое объявление в дом-дереве

function openAdvert(evt) {
  var target = evt.target;
  if (target.getAttribute('class') !== 'map__pin map__pin--main' && (target.getAttribute('class') === 'map__pin' || (target.tagName === 'IMG' && target.parentNode.getAttribute('class') !== 'map__pin map__pin--main'))) {
    if (target.tagName === 'IMG') {
      target = target.parentNode;
    }

    if (cityMap.querySelector('.map__card')) {
      var mapCard = cityMap.querySelector('.map__card');
      cityMap.removeChild(mapCard);
    }

    if (mapPins.querySelector('.map__pin--active')) {
      mapPins.querySelector('.map__pin--active').classList.remove('map__pin--active');
    }
    // console.log(target);

    target.classList.add('map__pin--active');
    // console.log('hello');
    var pinIndex;

    (function findRightAdvert() {
      for (var i = 1; i <= NUMBER_OF_ADVERTS; i++) {
        if (mapPins.querySelectorAll('.map__pin')[i].getAttribute('class') === 'map__pin map__pin--active') {
          pinIndex = i - 1;
        }
      }

      // console.log(pinIndex);
      var fragment = document.createDocumentFragment();
      fragment.appendChild(createOneAdvert(adverts[pinIndex]));
      cityMap.appendChild(fragment);
    })();

    getCloseButton();
  }
}

function getCloseButton() {
  var closeButton = cityMap.querySelector('.popup__close');
  closeButton.addEventListener('mouseup', function () {
    closeAdvert();
  });

  document.addEventListener('keydown', onPopupEscPress);
  closeButton.addEventListener('keydown', onPopupEnterPress);
}

function closeAdvert() {
  var mapCard = cityMap.querySelector('.map__card');
  cityMap.removeChild(mapCard);
  cityMap.querySelector('.map__pin--active').classList.remove('map__pin--active');
  document.removeEventListener('keydown', onPopupEscPress);
}

// задание 4.2

var price = mapForm.querySelector('#price');
var address = mapForm.querySelector('#address');
var title = mapForm.querySelector('#title');

(function checkCorrectData() {

  address.setAttribute('readonly', '');
  address.setAttribute('required', '');
  address.addEventListener('invalid', function () {
    return (title.validity.valueMissing === true ? title.setCustomValidity('Обязательное поле') : title.setCustomValidity(''));
  });

  title.setAttribute('minlength', '30');
  title.setAttribute('maxlength', '100');
  title.setAttribute('required', '');
  title.addEventListener('invalid', function () {
    if (title.validity.tooShort) {
      title.setCustomValidity('Заголовок должен состоять минимум из 30 символов');
    } else if (title.validity.tooLong) {
      title.setCustomValidity('Заголовок не должен превышать 100 символов');
    } else if (title.validity.valueMissing) {
      title.setCustomValidity('Обязательное поле');
    } else {
      title.setCustomValidity('');
    }
  });

  title.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value.length < 30) {
      target.setCustomValidity('Заголовок должен состоять минимум из 30 символов');
    } else {
      target.setCustomValidity('');
    }
  });

  price.setAttribute('type', 'number');
  price.setAttribute('value', '1000');
  price.setAttribute('min', '0');
  price.setAttribute('max', '1000000');
  price.setAttribute('required', '');

  price.addEventListener('invalid', function () {
    if (price.validity.rangeUnderflow) {
      price.setCustomValidity('Цена должна быть не меньше 0 руб.');
    } else if (title.validity.rangeOverflow) {
      price.setCustomValidity('Цена должна быть не больше 1 000 000 руб.');
    } else if (title.validity.valueMissing) {
      price.setCustomValidity('Обязательное поле');
    } else {
      price.setCustomValidity('');
    }
  });
})();

// ---------------------------------------------------------- //

(function synchronizeData() {
  var timein = mapForm.querySelector('#timein');
  var timeout = mapForm.querySelector('#timeout');

  timein.addEventListener('change', function () {
    timeout.selectedIndex = timein.selectedIndex;
  });

  timeout.addEventListener('change', function () {
    timein.selectedIndex = timeout.selectedIndex;
  });
})();

// ---------------------------------------------------------- //

var type = mapForm.querySelector('#type');

function onPriceInputChange() {
  var minPrices = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };
  price.setAttribute('min', minPrices[type.options[type.selectedIndex].value]);
}

type.addEventListener('change', onPriceInputChange);

// ---------------------------------------------------------- //

var room = mapForm.querySelector('#room_number');
var capacity = mapForm.querySelector('#capacity');
var OPTION_GUESTS_COUNT = 4;

function onGuestInputChange() {
  setAllOptions();
  switch (room.value) {
    case '1':
      capacity.querySelectorAll('option')[0].classList.add('hidden');
      capacity.querySelectorAll('option')[1].classList.add('hidden');
      capacity.querySelectorAll('option')[3].classList.add('hidden');
      capacity.querySelectorAll('option')[2].setAttribute('selected', '');
      break;
    case '2':
      capacity.querySelectorAll('option')[0].classList.add('hidden');
      capacity.querySelectorAll('option')[3].classList.add('hidden');
      capacity.querySelectorAll('option')[1].setAttribute('selected', '');
      break;
    case '3':
      capacity.querySelectorAll('option')[3].classList.add('hidden');
      capacity.querySelectorAll('option')[0].setAttribute('selected', '');
      break;
    case '100':
      capacity.querySelectorAll('option')[0].classList.add('hidden');
      capacity.querySelectorAll('option')[1].classList.add('hidden');
      capacity.querySelectorAll('option')[2].classList.add('hidden');
      capacity.querySelectorAll('option')[3].setAttribute('selected', '');
      break;
  }
}

function setAllOptions() {
  for (var i = 0; i < OPTION_GUESTS_COUNT; i++) {
    if (capacity.querySelectorAll('option')[i].getAttribute('class', 'hidden')) {
      capacity.querySelectorAll('option')[i].classList.remove('hidden');
    }
    if (capacity.querySelectorAll('option')[i].selected === true) {
      capacity.querySelectorAll('option')[i].removeAttribute('selected');
    }
  }
}

room.addEventListener('change', onGuestInputChange);

// ---------------------------------------------------------- //

mapForm.setAttribute('action', 'https://js.dump.academy/keksobooking');

// ---валидация формы по статье "Техники валидации формы"--------------------------------------- //
/*
function CustomValidation() { }

CustomValidation.prototype = {
  // Установим пустой массив сообщений об ошибках
  invalidities: [],

  // Метод, проверяющий валидность
  checkValidity: function () {

    // var validity = input.validity;
    address.validity.valueMissing === true ? title.setCustomValidity('Обязательное поле') : title.setCustomValidity('');

    if (title.validity.tooShort) {
      title.setCustomValidity('Заголовок должен состоять минимум из 30 символов');
    } else if (title.validity.tooLong) {
      title.setCustomValidity('Заголовок не должен превышать 100 символов');
    } else if (title.validity.valueMissing) {
      title.setCustomValidity('Обязательное поле');
    } else {
      title.setCustomValidity('');
    }

    if (price.validity.rangeUnderflow) {
      price.setCustomValidity('Цена должна быть не меньше 0');
    } else if (title.validity.rangeOverflow) {
      price.setCustomValidity('Цена должна быть не больше 1 000 000');
    } else if (title.validity.valueMissing) {
      price.setCustomValidity('Обязательное поле');
    } else {
      price.setCustomValidity('');
    }

    // И остальные проверки валидности...
  },

  // Добавляем сообщение об ошибке в массив ошибок
  addInvalidity: function (message) {
    this.invalidities.push(message);
  },

  // Получаем общий текст сообщений об ошибках
  getInvalidities: function () {
    return this.invalidities.join('. \n');
  }
};

var submit = mapForm.querySelector('.form__submit');
// for (var i = 0; i < 3; i++) {
var inputs = [title, price, address];
// inputs.push(mapForm.querySelectorAll[i]);
// }

// Добавляем обработчик клика на кнопку отправки формы
submit.addEventListener('click', function (e) {
  // Пройдёмся по всем полям
  for (var i = 0; i < inputs.length; i++) {

    var input = inputs[i];

    // Проверим валидность поля, используя встроенную в JavaScript функцию checkValidity()
    if (input.checkValidity() === false) {

      var inputCustomValidation = new CustomValidation(); // Создадим объект CustomValidation
      inputCustomValidation.checkValidity(input); // Выявим ошибки
      var customValidityMessage = inputCustomValidation.getInvalidities(); // Получим все сообщения об ошибках
      input.setCustomValidity(customValidityMessage); // Установим специальное сообщение об ошибке

      // Добавим ошибки в документ
      var customValidityMessageForHTML = inputCustomValidation.getInvaliditiesForHTML();
      input.insertAdjacentHTML('afterend', '<p class="error-message">' + customValidityMessageForHTML + '</p>');
      var stopSubmit = true;

    } // закончился if
  } // закончился цикл

  if (stopSubmit) {
    e.preventDefault();
  }
});
*/

function CustomValidation() {
  if (title.validity.tooShort) {
    title.setCustomValidity('Заголовок должен состоять минимум из 30 символов');
  } else if (title.validity.tooLong) {
    title.setCustomValidity('Заголовок не должен превышать 100 символов');
  } else if (title.validity.valueMissing) {
    title.setCustomValidity('Обязательное поле');
  } else {
    title.setCustomValidity('');
  }

  if (price.validity.rangeUnderflow) {
    price.setCustomValidity('Цена должна быть не меньше 0 руб.');
  } else if (title.validity.rangeOverflow) {
    price.setCustomValidity('Цена должна быть не больше 1 000 000 руб.');
  } else if (title.validity.valueMissing) {
    price.setCustomValidity('Обязательное поле');
  } else {
    price.setCustomValidity('');
  }

  return address.validity.valueMissing === true ? title.setCustomValidity('Обязательное поле') : title.setCustomValidity('');
}

var submit = mapForm.querySelector('.form__submit');

submit.addEventListener('click', CustomValidation);
