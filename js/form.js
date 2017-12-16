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
  var minPrices = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  function checkCorrectData() {
    window.address.setAttribute('readOnly', '');
    window.address.setAttribute('required', '');
    window.address.addEventListener('invalid', function () {
      return (window.address.validity.valueMissing === true ? window.address.setCustomValidity('Обязательное поле') : window.address.setCustomValidity(''));
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

    price.addEventListener('input', function () {
      if (price.validity.rangeUnderflow) {
        price.setCustomValidity('Цена должна быть не меньше ' + minPrices[type.options[type.selectedIndex].value] + ' руб.');
      } else if (price.validity.rangeOverflow) {
        price.setCustomValidity('Цена должна быть не больше 1 000 000 руб.');
      } else if (price.validity.valueMissing) {
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
  timein.addEventListener('change', onTimeInputChange);
  timeout.addEventListener('change', onTimeInputChange);

  function onPriceInputChange() {
    var types = ['flat', 'bungalo', 'house', 'palace'];
    var prices = [1000, 0, 5000, 10000];

    function syncValueWithMin(element, value) {
      element.min = value;
    }
    window.synchronizeFields(type, price, types, prices, syncValueWithMin);
  }
  type.addEventListener('change', onPriceInputChange);

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

  function setAllOptions(count) {
    for (var i = 0; i < count; i++) {
      capacity.querySelectorAll('option')[i].setAttribute('class', 'hidden');
      if (capacity.querySelectorAll('option')[i].selected === true) {
        capacity.querySelectorAll('option')[i].removeAttribute('selected');
      }
    }
  }
  room.addEventListener('change', onGuestInputChange);

  function setSynchronizeForDefault() {
    onPriceInputChange();
    onGuestInputChange();
  }
  setSynchronizeForDefault();

  window.mapForm.setAttribute('action', 'https://js.dump.academy/keksobooking');

  submit.addEventListener('click', onSubmitClick);

  var allInputs = window.mapForm.querySelectorAll('input');

  function onSubmitClick(evt) {
    checkBeforeSending();

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

  var errorCount = 0; // счетчик ошибок

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
    price.min = 1000;
  }

  reset.addEventListener('click', onResetClick);
})();
