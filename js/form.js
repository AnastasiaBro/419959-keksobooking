'use strict';

(function () {
  var minPrice = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };
  var timein = window.elements.mapForm.querySelector('#timein');
  var timeout = window.elements.mapForm.querySelector('#timeout');
  var price = window.elements.mapForm.querySelector('#price');
  var title = window.elements.mapForm.querySelector('#title');
  var type = window.elements.mapForm.querySelector('#type');
  var room = window.elements.mapForm.querySelector('#room_number');
  var capacity = window.elements.mapForm.querySelector('#capacity');
  var submit = window.elements.mapForm.querySelector('.form__submit');
  var reset = window.elements.mapForm.querySelector('.form__reset');
  var address = window.elements.mapForm.querySelector('#address');
  var allInputs = window.elements.mapForm.querySelectorAll('input');
  var errorCount = 0; // счетчик ошибок

  window.elements.mapForm.setAttribute('action', 'https://js.dump.academy/keksobooking');

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
      if (target.value.length < window.constants.MIN_LENGTH) {
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
      checkPriceValidity();
    });
  }
  checkCorrectData();

  function checkPriceValidity() {
    var validity = price.validity;
    if (validity.rangeUnderflow) {
      price.setCustomValidity('Цена должна быть не меньше ' + minPrice[type.options[type.selectedIndex].value] + ' руб.');
    } else if (validity.rangeOverflow) {
      price.setCustomValidity('Цена должна быть не больше 1 000 000 руб.');
    } else if (validity.valueMissing) {
      price.setCustomValidity('Обязательное поле');
    } else {
      price.setCustomValidity('');
    }
  }

  function onTimeInputChange(evt) {
    var firstField = evt.target === timeout ? timeout : timein;
    var secondField = evt.target === timeout ? timein : timeout;
    function syncValues(element, value) {
      element.value = value;
    }
    window.synchronizeFields(firstField, secondField, window.constants.TIMEOUT_VALUES, window.constants.TIMEIN_VALUES, syncValues);
  }

  function onPriceInputChange() {
    var types = ['flat', 'bungalo', 'house', 'palace'];
    var prices = [window.constants.MIN_FLAT_PRICE, window.constants.MIN_BUNGALO_PRICE, window.constants.MIN_HOUSE_PRICE, window.constants.MIN_PALACE_PRICE];

    function syncValueWithMin(element, value) {
      element.min = value;
    }
    window.synchronizeFields(type, price, types, prices, syncValueWithMin);
    checkPriceValidity();
  }

  function onGuestInputChange() {
    setAllOptions(window.constants.OPTION_GUESTS_COUNT);
    var capacityMapping = {
      '1': {
        value: 1,
        items: [2]
      },
      '2': {
        value: 2,
        items: [1, 2]
      },
      '3': {
        value: 3,
        items: [0, 1, 2]
      },
      '100': {
        value: 0,
        items: [3]
      }
    };
    capacityMapping[room.value].items.forEach(function (item) {
      capacity.querySelectorAll('option')[item].classList.remove('hidden');
    });
    capacity.value = capacityMapping[room.value].value;
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
      window.backend.save(new FormData(window.elements.mapForm), function () {
        window.elements.mapForm.reset();
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
    price.min = window.constants.MIN_FLAT_PRICE;
    hideRedBorders();
    resetImages();
    window.elements.mainButton.style = '';
    window.addAddress(address);
  }

  function hideRedBorders() {
    for (var i = 0; i < allInputs.length; i++) {
      allInputs[i].removeAttribute('style');
    }
  }

  function resetImages() {
    var allImages = window.elements.photoContainer.querySelectorAll('img');
    if (window.elements.preview.src !== 'img/muffin.png') {
      window.elements.preview.src = 'img/muffin.png';
    }
    for (var i = 0; i < allImages.length; i++) {
      window.elements.photoContainer.removeChild(allImages[i]);
    }
  }

  timein.addEventListener('change', onTimeInputChange);
  timeout.addEventListener('change', onTimeInputChange);
  type.addEventListener('change', onPriceInputChange);
  room.addEventListener('change', onGuestInputChange);
  submit.addEventListener('click', onSubmitClick);
  reset.addEventListener('click', onResetClick);
})();
