'use strict';

(function () {
  var Translation = {
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    BUNGALO: 'Бунгало'
  };
  var similarMapCardTemplate = document.querySelector('template').content;
  var mapCardTemplate = similarMapCardTemplate.querySelector('article.map__card');

  function addFeatures(advert, advertElement) {
    var featuresContainer = advertElement.querySelector('.popup__features');
    var featureElements = featuresContainer.querySelectorAll('li');

    [].forEach.call(featureElements, function (item) {
      featuresContainer.removeChild(item);
    });

    advert.offer.features.forEach(function (item) {
      var li = document.createElement('li');
      li.setAttribute('class', 'feature feature--' + item);
      featuresContainer.appendChild(li);
    });
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
    var picturesContainer = advertElement.querySelector('.popup__pictures');
    var textElements = advertElement.querySelectorAll('p');
    var extra = picturesContainer.querySelector('li');
    addFeatures(advert, advertElement);

    advertElement.querySelector('h3').textContent = advert.offer.title;
    advertElement.querySelector('small').textContent = advert.offer.address;
    advertElement.querySelector('.popup__price').textContent = advert.offer.price + ' ' + String.fromCharCode(8381) + ' / ночь';
    advertElement.querySelector('h4').textContent = Translation[advert.offer.type.toUpperCase()];

    textElements[2].textContent = advert.offer.rooms + ' комнат' + addCorrectRoomEnding(advert) + ' для ' + advert.offer.guests + ' гост' + addCorrectGuestEnding(advert);
    textElements[3].textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;

    textElements[4].textContent = advert.offer.description;
    advertElement.querySelector('.popup__avatar').setAttribute('src', advert.author.avatar);

    picturesContainer.removeChild(extra);

    advert.offer.photos.forEach(function (item) {
      var li = document.createElement('li');
      li.innerHTML = '<img src=' + item + ' style="width: 40px; height: 40px; padding-right: 5px; padding-bottom: 2px;">';
      picturesContainer.appendChild(li);
    });

    return advertElement;
  }
  window.createOneAdvert = createOneAdvert;
})();
