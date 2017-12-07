'use strict';

(function () {
  function createAllAdverts(advert) {
    var advertElement = document.createElement('button');
    advertElement.setAttribute('class', 'map__pin');
    advertElement.setAttribute('style', 'left: ' + advert.location.x + 'px; top: ' + (advert.location.y - window.MAP_HEIGHT / 2 - window.POINTER_HEIGHT) + 'px;');
    advertElement.innerHTML = '<img width="40" height="40" draggable="false">';
    advertElement.querySelector('img').setAttribute('src', advert.author.avatar);
    return advertElement;
  }

  function insertAdvert(advertsCount) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < advertsCount; i++) {
      fragment.appendChild(createAllAdverts(window.adverts[i]));
    }
    window.mapPins.appendChild(fragment);
  }

  insertAdvert(window.NUMBER_OF_ADVERTS);
})();
