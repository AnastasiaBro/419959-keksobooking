'use strict';

(function () {
  function createAllAdverts(advert) {
    var advertElement = document.createElement('button');
    advertElement.setAttribute('class', 'map__pin hidden');
    advertElement.setAttribute('style', 'left: ' + advert.location.x + 'px; top: ' + (advert.location.y - window.MAP_HEIGHT / 2 - window.POINTER_HEIGHT) + 'px;');
    advertElement.innerHTML = '<img width="40" height="40" draggable="false">';
    advertElement.querySelector('img').setAttribute('src', advert.author.avatar);
    return advertElement;
  }

  window.backend.load(function (adverts) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < adverts.length; i++) {
      fragment.appendChild(createAllAdverts(adverts[i]));
    }
    window.mapPins.appendChild(fragment);
    window.adverts = adverts;
  });
})();
