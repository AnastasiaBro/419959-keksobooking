'use strict';

(function () {
  function createOnePin(advert) {
    var advertElement = document.createElement('button');
    advertElement.setAttribute('tabindex', '0');
    advertElement.setAttribute('class', 'map__pin');
    advertElement.setAttribute('style', 'left: ' + advert.location.x + 'px; top: ' + (advert.location.y - window.constants.PIN_HEIGHT / 2 - window.constants.POINTER_HEIGHT) + 'px;');
    advertElement.innerHTML = '<img width="40" height="40" draggable="false">';
    advertElement.querySelector('img').setAttribute('src', advert.author.avatar);
    return advertElement;
  }

  function getRandomStartElements(count) {
    var randomIndexes = createNumbersArray(window.adverts.length);
    var newPins = [];
    for (var i = 0; i < count; i++) {
      newPins.push(window.adverts[window.util.getUniquePart(randomIndexes)]);
    }
    return newPins;
  }

  function showMapPins(array) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < array.length; i++) {
      fragment.appendChild(createOnePin(array[i]));
    }
    window.elements.mapPins.appendChild(fragment);
  }

  function createNumbersArray(count) {
    var numbers = [];
    for (var i = 0; i < count; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  function onLoadSuccess(adverts) {
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
    window.elements.cityMap.appendChild(message);
  }

  window.getRandomStartElements = getRandomStartElements;
  window.showMapPins = showMapPins;

  window.onLoadError = onLoadError;
  window.backend.load(onLoadSuccess, onLoadError);
})();
