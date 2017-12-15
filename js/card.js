'use strict';

(function () {
  var similarMapCardTemplate = document.querySelector('template').content;
  var mapCardTemplate = similarMapCardTemplate.querySelector('article.map__card');

  function addFeatures(advert, advertElement) {
    var i = 0;
    if (advert.offer.features.length < window.COUNT_FEATURES) {
      for (i = advert.offer.features.length; i < window.COUNT_FEATURES; i++) {
        var extra = advertElement.querySelectorAll('.popup__features li')[advert.offer.features.length];
        advertElement.querySelector('.popup__features').removeChild(extra);
      }
    }
    for (i = 0; i < advert.offer.features.length; i++) {
      advertElement.querySelectorAll('.popup__features li')[i].setAttribute('class', 'feature feature--' + advert.offer.features[i]);
    }
  }

  function translatePlaceType(englishType) {
    var translate = {
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    };
    return translate[englishType];
  }

  function addCorrectRoomEnding(advertForRoom) {
    var ending = '';
    if (advertForRoom.offer.rooms % 5 !== 0 && advertForRoom.offer.rooms !== 0) {
      ending = (advertForRoom.offer.rooms === 1) ? 'а' : 'ы';
    }
    return ending;
  }

  function addCorrectGuestEnding(advertForGuest) {
    var ending = (advertForGuest.offer.guests % 10 === 1 && advertForGuest.offer.guests !== 11) === true ? 'я' : 'ей';
    return ending;
  }

  function createOneAdvert(advert) {
    var advertElement = mapCardTemplate.cloneNode(true);
    addFeatures(advert, advertElement);

    advertElement.querySelector('h3').textContent = advert.offer.title;
    advertElement.querySelector('small').textContent = advert.offer.address;
    advertElement.querySelector('.popup__price').textContent = advert.offer.price + ' ' + String.fromCharCode(8381) + ' / ночь';
    advertElement.querySelector('h4').textContent = translatePlaceType(advert.offer.type);

    advertElement.querySelectorAll('p')[2].textContent = advert.offer.rooms + ' комнат' + addCorrectRoomEnding(advert) + ' для ' + advert.offer.guests + ' гост' + addCorrectGuestEnding(advert);
    advertElement.querySelectorAll('p')[3].textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;

    advertElement.querySelectorAll('p')[4].textContent = advert.offer.description;
    advertElement.querySelector('.popup__avatar').setAttribute('src', advert.author.avatar);
    var extra = advertElement.querySelector('.popup__pictures li');
    advertElement.querySelector('.popup__pictures').removeChild(extra);

    for (var i = 0; i < advert.offer.photos.length; i++) {
      var li = document.createElement('li');
      li.innerHTML = '<img src=' + advert.offer.photos[i] + '>';
      advertElement.querySelector('.popup__pictures').appendChild(li);
    }

    return advertElement;
  }
  window.createOneAdvert = createOneAdvert;
})();
