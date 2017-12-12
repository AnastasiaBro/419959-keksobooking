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

  function onTimeChange(evt) {
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

  timein.addEventListener('change', onTimeChange);
  timeout.addEventListener('change', onTimeChange);

  function onPriceInputChange() {
    var types = ['flat', 'bungalo', 'house', 'palace'];
    var prices = [1000, 0, 5000, 10000];

    function syncValueWithMin(element, value) {
      element.min = value;
    }
    window.synchronizeFields(type, price, types, prices, syncValueWithMin);
  }

  function setSynchronizeForDefault() {
    onPriceInputChange();
    onGuestInputChange();
  }
  setSynchronizeForDefault();

  type.addEventListener('change', onPriceInputChange);
  room.addEventListener('change', onGuestInputChange);

  function onGuestInputChange() {
    setAllOptions(window.OPTION_GUESTS_COUNT);
    switch (room.value) {
      case '1':
        capacity.querySelectorAll('option')[0].classList.add('hidden');
        capacity.querySelectorAll('option')[1].classList.add('hidden');
        capacity.querySelectorAll('option')[3].classList.add('hidden');
        capacity.querySelectorAll('option')[2].setAttribute('selected', '');
        break;
      case '2':
        capacity.querySelectorAll('option')[0].classList.add('hidden');
        capacity.querySelectorAll('option')[3].classList.add('hidden');
        capacity.querySelectorAll('option')[1].setAttribute('selected', '');
        break;
      case '3':
        capacity.querySelectorAll('option')[3].classList.add('hidden');
        capacity.querySelectorAll('option')[0].setAttribute('selected', '');
        break;
      case '100':
        capacity.querySelectorAll('option')[0].classList.add('hidden');
        capacity.querySelectorAll('option')[1].classList.add('hidden');
        capacity.querySelectorAll('option')[2].classList.add('hidden');
        capacity.querySelectorAll('option')[3].setAttribute('selected', '');
        break;
    }
  }

  function setAllOptions(count) {
    for (var i = 0; i < count; i++) {
      if (capacity.querySelectorAll('option')[i].getAttribute('class', 'hidden')) {
        capacity.querySelectorAll('option')[i].classList.remove('hidden');
      }
      if (capacity.querySelectorAll('option')[i].selected === true) {
        capacity.querySelectorAll('option')[i].removeAttribute('selected');
      }
    }
  }

  window.mapForm.setAttribute('action', 'https://js.dump.academy/keksobooking');

  submit.addEventListener('click', onSubmitClick);

  function onSubmitClick() {
    checkBeforeSending();
  }

  function checkBeforeSending() {
    var allInputs = window.mapForm.querySelectorAll('input');
    var allSelects = window.mapForm.querySelectorAll('select');
    checkForm(allInputs);
    checkForm(allSelects);
  }

  function checkForm(formElements) {
    for (var i = 0; i < formElements.length; i++) {
      if (!formElements[i].validity.valid) {
        formElements[i].setAttribute('style', 'border: 2px solid red;');
      } else {
        formElements[i].removeAttribute('style');
      }
    }
  }
})();
