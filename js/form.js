'use strict';

(function () {
  var timein = window.mapForm.querySelector('#timein');
  var timeout = window.mapForm.querySelector('#timeout');
  var timeinArray = ['12:00', '13:00', '14:00'];
  var timeoutArray = ['12:00', '13:00', '14:00'];
  var price = window.mapForm.querySelector('#price');
  var title = window.mapForm.querySelector('#title');
  var type = window.mapForm.querySelector('#type');
  var room = window.mapForm.querySelector('#room_number');
  var capacity = window.mapForm.querySelector('#capacity');
  var submit = window.mapForm.querySelector('.form__submit');
  var reset = window.mapForm.querySelector('.form__reset');
  var address = window.mapForm.querySelector('#address');
  var allInputs = window.mapForm.querySelectorAll('input');
  var errorCount = 0; // счетчик ошибок
  var minPrices = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  window.mapForm.setAttribute('action', 'https://js.dump.academy/keksobooking');

  function checkCorrectData() {
    address.setAttribute('readOnly', '');
    address.setAttribute('required', '');
    address.addEventListener('invalid', function () {
      return (address.validity.valueMissing ? address.setCustomValidity('Обязательное поле') : address.setCustomValidity(''));
    });

    title.setAttribute('minlength', '30');
    title.setAttribute('maxlength', '100');
    title.setAttribute('required', '');

    title.addEventListener('invalid', function () {
      var validity = title.validity;
      if (validity.tooShort) {
        title.setCustomValidity('Заголовок должен состоять минимум из 30 символов');
      } else if (validity.tooLong) {
        title.setCustomValidity('Заголовок не должен превышать 100 символов');
      } else if (validity.valueMissing) {
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
    price.setAttribute('placeholder', '1000');
    price.setAttribute('min', '0');
    price.setAttribute('max', '1000000');
    price.setAttribute('required', '');

    price.addEventListener('input', function () {
      var validity = price.validity;
      if (validity.rangeUnderflow) {
        price.setCustomValidity('Цена должна быть не меньше ' + minPrices[type.options[type.selectedIndex].value] + ' руб.');
      } else if (validity.rangeOverflow) {
        price.setCustomValidity('Цена должна быть не больше 1 000 000 руб.');
      } else if (validity.valueMissing) {
        price.setCustomValidity('Обязательное поле');
      } else {
        price.setCustomValidity('');
      }
    });
  }
  checkCorrectData();

  function onTimeInputChange(evt) {
    var firstField = timein;
    var secondField = timeout;

    if (evt.target === timeout) {
      firstField = timeout;
      secondField = timein;
    }
    function syncValues(element, value) {
      element.value = value;
    }
    window.synchronizeFields(firstField, secondField, timeoutArray, timeinArray, syncValues);
  }

  function onPriceInputChange() {
    var types = ['flat', 'bungalo', 'house', 'palace'];
    var prices = [1000, 0, 5000, 10000];

    function syncValueWithMin(element, value) {
      element.min = value;
    }
    window.synchronizeFields(type, price, types, prices, syncValueWithMin);
  }

  function onGuestInputChange() {
    setAllOptions(window.OPTION_GUESTS_COUNT);
    switch (room.value) {
      case '1':
        capacity.querySelectorAll('option')[2].classList.remove('hidden');
        capacity.value = 1;
        break;
      case '2':
        capacity.querySelectorAll('option')[1].classList.remove('hidden');
        capacity.querySelectorAll('option')[2].classList.remove('hidden');
        capacity.value = 2;
        break;
      case '3':
        capacity.querySelectorAll('option')[0].classList.remove('hidden');
        capacity.querySelectorAll('option')[1].classList.remove('hidden');
        capacity.querySelectorAll('option')[2].classList.remove('hidden');
        capacity.value = 3;
        break;
      case '100':
        capacity.querySelectorAll('option')[3].classList.remove('hidden');
        capacity.value = 0;
        break;
    }
  }

  // скрываем все options перед новой синхронизацией
  function setAllOptions(count) {
    for (var i = 0; i < count; i++) {
      capacity.querySelectorAll('option')[i].setAttribute('class', 'hidden');
      if (capacity.querySelectorAll('option')[i].selected === true) {
        capacity.querySelectorAll('option')[i].removeAttribute('selected');
      }
    }
  }

  function setSynchronizeForDefault() {
    onPriceInputChange();
    onGuestInputChange();
  }
  setSynchronizeForDefault();

  function onSubmitClick(evt) {
    checkBeforeSending();
    window.addAddress(address);

    if (errorCount === 0) {
      evt.preventDefault();
      window.backend.save(new FormData(window.mapForm), function () {
        window.mapForm.reset();
        onResetClick();
      }, window.onLoadError);
    }
  }

  function checkBeforeSending() {
    checkForm(allInputs);
  }

  function checkForm(formElements) {
    errorCount = 0;
    for (var i = 0; i < formElements.length; i++) {
      if (!formElements[i].validity.valid) {
        formElements[i].setAttribute('style', 'border: 2px solid red;');
        errorCount = errorCount + 1;
      } else {
        formElements[i].removeAttribute('style');
      }
    }
  }

  function onResetClick() {
    capacity.querySelectorAll('option')[2].setAttribute('selected', '');
    hideRedBorders();
    resetImages();
    window.mainButton.style = '';
    window.addAddress(address);
  }

  function hideRedBorders() {
    for (var i = 0; i < allInputs.length; i++) {
      allInputs[i].removeAttribute('style');
    }
  }

  function resetImages() {
    var allImages = window.photoContainer.querySelectorAll('img');
    if (window.preview.src !== 'img/muffin.png') {
      window.preview.src = 'img/muffin.png';
    }
    if (allImages) {
      for (var i = 0; i < allImages.length; i++) {
        window.photoContainer.removeChild(allImages[i]);
      }
    }
  }

  timein.addEventListener('change', onTimeInputChange);
  timeout.addEventListener('change', onTimeInputChange);
  type.addEventListener('change', onPriceInputChange);
  room.addEventListener('change', onGuestInputChange);
  submit.addEventListener('click', onSubmitClick);
  reset.addEventListener('click', onResetClick);
})();
