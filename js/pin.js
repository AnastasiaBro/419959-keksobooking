'use strict';

(function () {
  function createAllAdverts(advert) {
    var advertElement = document.createElement('button');
    advertElement.setAttribute('class', 'map__pin');
    advertElement.setAttribute('style', 'left: ' + advert.location.x + 'px; top: ' + (advert.location.y - window.PIN_HEIGHT / 2 - window.POINTER_HEIGHT) + 'px;');
    advertElement.innerHTML = '<img width="40" height="40" draggable="false">';
    advertElement.querySelector('img').setAttribute('src', advert.author.avatar);
    return advertElement;
  }

  // надо будет отредактить

  function showMapPins(count) {
    var randomIndexes = createNumbersArray(window.adverts.length);
    var newPins = [];
    for (var i = 0; i < count; i++) {
      newPins.push(window.adverts[window.util.getUniquePart(randomIndexes)]);
    }
    console.log(randomIndexes);
    console.log(newPins);

    for (i = 0; i < count; i++) {
      var fragment = document.createDocumentFragment();
      fragment.appendChild(createAllAdverts(newPins[i]));
      window.mapPins.appendChild(fragment);
    }
    window.newPins = newPins;
  }

  function createNumbersArray(count) {
    var numbers = [];
    for (var i = 0; i < count; i++) {
      numbers.push(i);
    }
    return numbers;
  }
  window.showMapPins = showMapPins;

  function onLoadSuccess(adverts) {
    /* var fragment = document.createDocumentFragment();

    for (var i = 0; i < adverts.length; i++) {
      fragment.appendChild(createAllAdverts(adverts[i]));
    }
    window.mapPins.appendChild(fragment);*/
    window.adverts = adverts;
  }

  function onLoadError(errorMessage) {
    var message = document.createElement('div');
    var style = message.style;
    style.position = 'fixed';
    style.top = '40px';
    style.left = '0';
    style.right = '0';

    style.zIndex = '100';
    style.margin = '0 auto';
    style.paddingTop = '20px';

    style.textAlign = 'center';
    style.height = '40px';
    style.maxWidth = '600px';

    style.backgroundColor = 'white';
    style.border = '4px solid red';
    style.borderRadius = '10px';
    style.fontSize = '20px';

    message.textContent = errorMessage;
    window.cityMap.appendChild(message);
  }

  window.onLoadError = onLoadError;
  window.backend.load(onLoadSuccess, onLoadError);
})();
