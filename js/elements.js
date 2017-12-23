'use strict';

(function () {
  window.cityMap = document.querySelector('.map');
  window.mainButton = window.cityMap.querySelector('.map__pin--main'); // это пироженка
  window.mapForm = document.querySelector('.notice__form'); // это форма
  window.mapPins = document.querySelector('.map__pins');
  window.avatarContainer = document.querySelector('.upload');
  window.preview = window.avatarContainer.querySelector('img');
  window.photoContainer = document.querySelector('.form__photo-container');
})();
